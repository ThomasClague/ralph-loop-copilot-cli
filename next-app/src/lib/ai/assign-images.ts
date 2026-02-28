import type {
  SiteSection,
  HeroContent,
  AboutContent,
  GalleryContent,
  TeamContent,
} from "../../types/site";
import type { Prospect } from "../../db/repository";
import type { CrawlResult } from "../scraping/types";
import { searchPhotos } from "../images/pexels";
import { getImageQuery } from "../images/industry-queries";
import { getMediaBySlotAndIndustry } from "../../db/repository";

const EXCLUDED_IMAGE_PATTERNS = ["icon", "logo", "favicon", "sprite"];

/** Filter scraped images to exclude tiny icons, logos, and data URIs. */
function getFilteredScrapedImages(crawlResult: CrawlResult): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  // Homepage first (pages[0]), then the rest
  for (const page of crawlResult.pages) {
    for (const img of page.images) {
      const src = img.src;
      if (!src || seen.has(src)) continue;
      if (src.startsWith("data:")) continue;
      const srcLower = src.toLowerCase();
      if (EXCLUDED_IMAGE_PATTERNS.some((p) => srcLower.includes(p))) continue;
      seen.add(src);
      result.push(src);
    }
  }
  return result;
}

/**
 * Fetch a Pexels image for the given industry and slot.
 * Returns empty string if Pexels is unavailable or returns no results.
 */
async function fetchPexelsImage(
  industry: string,
  slot: string,
): Promise<string> {
  const query = getImageQuery(industry, slot);
  const photos = await searchPhotos(query, 1);
  return photos[0]?.url ?? "";
}

/**
 * Stage 4 of the AI pipeline — assigns images to section slots.
 *
 * Priority order:
 *   1. Manual uploads matched by slot + industry from the batch media library
 *   2. Scraped images from the crawl (filtered, homepage-first)
 *   3. Pexels API fallback (sequential to avoid rate limiting)
 */
export async function assignImages(
  sections: SiteSection[],
  prospect: Prospect,
  batchId: string,
): Promise<SiteSection[]> {
  const industry = prospect.industry ?? "construction";

  // Build scraped image pool (Tier 2)
  const crawlResult = prospect.scrapedRaw
    ? (prospect.scrapedRaw as unknown as CrawlResult)
    : null;
  const scrapedPool: string[] = crawlResult
    ? getFilteredScrapedImages(crawlResult)
    : [];
  let scrapedIndex = 0;

  /** Pick next scraped image, or empty string if exhausted. */
  function nextScraped(): string {
    return scrapedIndex < scrapedPool.length ? scrapedPool[scrapedIndex++] : "";
  }

  /** Resolve a single image URL via 3-tier priority. */
  async function resolveOne(slot: string): Promise<string> {
    // Tier 1: manual uploads
    const uploads = await getMediaBySlotAndIndustry(batchId, slot, industry);
    if (uploads.length > 0) return uploads[0].path;

    // Tier 2: scraped images
    const scraped = nextScraped();
    if (scraped) return scraped;

    // Tier 3: Pexels
    return fetchPexelsImage(industry, slot);
  }

  /** Resolve multiple images via 3-tier priority (sequential for Pexels rate limit). */
  async function resolveMany(slot: string, count: number): Promise<string[]> {
    const urls: string[] = [];
    const uploads = await getMediaBySlotAndIndustry(batchId, slot, industry);

    for (let i = 0; i < count; i++) {
      if (i < uploads.length) {
        urls.push(uploads[i].path);
        continue;
      }
      const scraped = nextScraped();
      if (scraped) {
        urls.push(scraped);
        continue;
      }
      // Pexels: vary query slightly for subsequent images
      const query = getImageQuery(industry, slot) + (i > 0 ? ` ${i + 1}` : "");
      const photos = await searchPhotos(query, 1);
      const url = photos[0]?.url ?? "";
      urls.push(url);
    }

    return urls;
  }

  const result: SiteSection[] = [];

  for (const section of sections) {
    switch (section.type) {
      case "hero": {
        const content = section.content as HeroContent;
        if (!content.imageUrl) {
          const url = await resolveOne("hero");
          result.push({ ...section, content: { ...content, imageUrl: url } });
        } else {
          result.push(section);
        }
        break;
      }

      case "about": {
        const content = section.content as AboutContent;
        if (!content.imageUrl) {
          const url = await resolveOne("about");
          result.push({ ...section, content: { ...content, imageUrl: url } });
        } else {
          result.push(section);
        }
        break;
      }

      case "gallery": {
        const content = section.content as GalleryContent;
        const emptyCount = content.images.filter((img) => !img.url).length;
        if (emptyCount > 0) {
          const newUrls = await resolveMany("gallery", emptyCount);
          let urlIndex = 0;
          const updatedImages = content.images.map((img) =>
            img.url ? img : { ...img, url: newUrls[urlIndex++] ?? "" },
          );
          result.push({
            ...section,
            content: { ...content, images: updatedImages },
          });
        } else {
          result.push(section);
        }
        break;
      }

      case "team": {
        const content = section.content as TeamContent;
        const hasEmpty = content.members.some((m) => !m.imageUrl);
        if (hasEmpty) {
          const updatedMembers = await Promise.resolve(
            content.members.reduce(
              async (accP, member) => {
                const acc = await accP;
                if (member.imageUrl) {
                  acc.push(member);
                } else {
                  const url = await resolveOne("team");
                  acc.push({ ...member, imageUrl: url });
                }
                return acc;
              },
              Promise.resolve([] as TeamContent["members"]),
            ),
          );
          result.push({
            ...section,
            content: { ...content, members: updatedMembers },
          });
        } else {
          result.push(section);
        }
        break;
      }

      default:
        result.push(section);
    }
  }

  return result;
}
