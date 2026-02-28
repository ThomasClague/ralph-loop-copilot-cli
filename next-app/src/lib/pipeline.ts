import type { SiteConfig } from "../types/site";
import {
  getProspect,
  updateProspect,
  updateProspectStatus,
} from "../db/repository";
import { crawlUrl } from "./scraping/client";
import { extractBusinessData } from "./ai/extract";
import { condenseBusinessData } from "./ai/condense";
import { generateStructure } from "./ai/generate-structure";
import { generateContent } from "./ai/generate-content";
import { assignImages } from "./ai/assign-images";
import { assignVariants } from "./ai/assign-variants";
import { selectPalette } from "./ai/theming";
import type { BrandingData } from "../scraper/types";

/**
 * Orchestrates the full 6-stage AI pipeline for a single prospect.
 *
 * Stages:
 *   1a  Scraping        — crawl existing_url (if set)
 *   1b  Extraction      — programmatic data extraction
 *   1b' Condensation    — AI condensation (if token estimate >= 4000)
 *   2   Structure       — AI section selection and ordering
 *   3   Content         — AI copy generation
 *   4   Images          — image slot assignment (stub until TASK-53)
 *   5   Variants        — deterministic variant assignment
 *   6   Theming         — palette selection / derivation
 *
 * Status transitions written to DB at each stage so the UI can poll progress.
 *
 * @param prospectId - UUID of the prospect row to process
 * @returns Final SiteConfig persisted to DB
 * @throws Re-throws after setting status = 'failed'
 */
export async function runPipeline(prospectId: string): Promise<SiteConfig> {
  // ── Load prospect ───────────────────────────────────────────────────────────
  const prospect = await getProspect(prospectId);
  if (!prospect) throw new Error(`Prospect not found: ${prospectId}`);

  try {
    // ── Stage 1a: Scraping ────────────────────────────────────────────────────
    let crawlResult = null;
    let branding: BrandingData = { colors: [], fonts: [], logoUrl: null };

    if (prospect.existingUrl) {
      await updateProspectStatus(prospectId, "scraping");
      crawlResult = await crawlUrl(prospect.existingUrl);
      branding = crawlResult.branding;
      await updateProspect(prospectId, {
        scrapedRaw: crawlResult as unknown as string,
        scrapedBranding: crawlResult.branding as unknown as string,
      });
    }

    await updateProspectStatus(prospectId, "analyzing");

    // ── Stage 1b: Extraction ──────────────────────────────────────────────────
    const prospectInput = {
      business_name: prospect.businessName,
      industry: prospect.industry,
      website_url: prospect.existingUrl ?? undefined,
    };

    // Build a minimal CrawlResult if no URL was provided
    const effectiveCrawlResult = crawlResult ?? {
      success: true,
      pages: [],
      branding,
    };

    const extractedData = extractBusinessData(
      effectiveCrawlResult,
      prospectInput,
    );
    await updateProspect(prospectId, {
      extractedData: extractedData as unknown as string,
    });

    // ── Stage 1b': Condensation ───────────────────────────────────────────────
    const condensedProfile = await condenseBusinessData(
      extractedData,
      effectiveCrawlResult,
      prospect.industry,
    );
    await updateProspect(prospectId, {
      condensedProfile: condensedProfile as unknown as string,
    });

    await updateProspectStatus(prospectId, "generating");

    // ── Stage 2: Structure decision ───────────────────────────────────────────
    const structureInput = {
      businessName: prospect.businessName,
      industry: prospect.industry,
      location: prospect.location,
    };
    const structure = await generateStructure(condensedProfile, structureInput);
    await updateProspect(prospectId, {
      structure: structure as unknown as string,
    });

    // ── Stage 3: Content generation ───────────────────────────────────────────
    let sections = await generateContent(
      structure,
      condensedProfile,
      structureInput,
    );
    await updateProspect(prospectId, {
      siteContent: sections as unknown as string,
    });

    // ── Stage 4: Image assignment ─────────────────────────────────────────────
    await updateProspectStatus(prospectId, "sourcing_images");
    sections = await assignImages(sections, prospect, prospect.batchId);

    // ── Stage 5: Variant assignment ───────────────────────────────────────────
    await updateProspectStatus(prospectId, "assembling");
    sections = assignVariants(
      sections,
      prospect.businessName,
      prospect.industry,
    );

    // ── Stage 6: Color theming ────────────────────────────────────────────────
    const themeSelection = selectPalette(branding, structure.paletteHint);

    // ── Build SiteConfig ──────────────────────────────────────────────────────
    const siteConfig: SiteConfig = {
      slug: prospect.slug,
      businessInfo: {
        name: prospect.businessName,
        phone: prospect.phone ?? "",
        email: prospect.email ?? "",
        location: prospect.location,
        industry: prospect.industry,
      },
      sections,
      paletteId: themeSelection.paletteId,
      customPalette: themeSelection.customPalette,
    };

    await updateProspect(prospectId, {
      siteConfig: siteConfig as unknown as string,
      customPalette: themeSelection.customPalette as unknown as string,
    });

    await updateProspectStatus(prospectId, "ready");

    return siteConfig;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    await updateProspectStatus(prospectId, "failed");
    await updateProspect(prospectId, {
      notes: `Pipeline failed: ${message}`,
    });
    throw err;
  }
}
