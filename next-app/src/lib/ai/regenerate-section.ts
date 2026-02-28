import { generateObject } from "ai";
import { model } from "./client";
import { contentSchema, type CondensedProfile } from "./schemas";
import { getProspect, updateProspect } from "../../db/repository";
import type { SiteSection, SiteConfig, SectionType } from "../../types/site";

/**
 * Regenerates the copy for a single section without re-running the full pipeline.
 *
 * Loads the existing prospect, generates new content only for the specified section,
 * replaces the section in site_config, saves to DB, and returns the updated SiteSection.
 */
export async function regenerateSection(
  prospectId: string,
  sectionId: string,
): Promise<SiteSection> {
  const prospect = await getProspect(prospectId);
  if (!prospect) {
    throw new Error(`Prospect not found: ${prospectId}`);
  }

  const siteConfig = prospect.siteConfig as unknown as SiteConfig;
  if (!siteConfig?.sections) {
    throw new Error(`Prospect ${prospectId} has no site config`);
  }

  const section = siteConfig.sections.find((s) => s.id === sectionId);
  if (!section) {
    throw new Error(
      `Section not found: ${sectionId} in prospect ${prospectId}`,
    );
  }

  const condensedProfile =
    prospect.condensedProfile as unknown as CondensedProfile;
  const businessName =
    siteConfig.businessInfo?.name ?? prospect.businessName ?? "this business";
  const industry =
    siteConfig.businessInfo?.industry ?? prospect.industry ?? "home services";
  const location = siteConfig.businessInfo?.location ?? prospect.location ?? "";

  const prompt = `Generate new content for the ${section.type} section of ${businessName}'s website.
Be specific to ${industry} in ${location}.
Profile: ${condensedProfile?.summary ?? `A ${industry} business in ${location}.`}

Generate content for only the "${section.type}" section. Fill all relevant fields with compelling, specific copy.`;

  const { object } = await generateObject({
    model,
    schema: contentSchema,
    prompt,
  });

  const newContent = object[section.type as SectionType] ?? {};

  const updatedSection: SiteSection = {
    ...section,
    content: newContent as SiteSection["content"],
  };

  const updatedConfig: SiteConfig = {
    ...siteConfig,
    sections: siteConfig.sections.map((s) =>
      s.id === sectionId ? updatedSection : s,
    ),
  };

  await updateProspect(prospectId, {
    siteConfig: updatedConfig as unknown as string,
  });

  return updatedSection;
}
