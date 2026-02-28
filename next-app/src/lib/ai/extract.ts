import type { CrawlResult } from "../scraping/types";
import { INDUSTRY_KEYWORDS } from "./industry-keywords";

/** Input data provided by the user when submitting a prospect for generation. */
export interface ProspectInputData {
  business_name: string;
  industry: string;
  website_url?: string;
}

/** Structured output of the programmatic extraction stage (Stage 1b Part A). */
export interface ExtractedData {
  businessName: string;
  phones: string[];
  emails: string[];
  address: string | null;
  services: string[];
  testimonials: string[];
  headings: string[];
  imageUrls: string[];
  totalTokenEstimate: number;
}

const UK_POSTCODE_REGEX = /\b[A-Z]{1,2}\d[\dA-Z]?\s*\d[A-Z]{2}\b/gi;

const TESTIMONIAL_PATTERNS = [
  /highly recommend/i,
  /great service/i,
  /excellent work/i,
  /very professional/i,
  /fantastic job/i,
  /5 stars/i,
  /five stars/i,
  /couldn['']t be happier/i,
  /would recommend/i,
  /amazing service/i,
  /outstanding work/i,
  /truly impressed/i,
  /exceeded expectations/i,
];

/** Extract the most common h1 text across all pages. */
function extractBusinessName(
  pages: CrawlResult["pages"],
  fallback: string,
): string {
  const h1Counts: Record<string, number> = {};
  for (const page of pages) {
    const h1s = page.headings["h1"] ?? [];
    for (const h1 of h1s) {
      const trimmed = h1.trim();
      if (trimmed) {
        h1Counts[trimmed] = (h1Counts[trimmed] ?? 0) + 1;
      }
    }
  }
  const sorted = Object.entries(h1Counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? fallback;
}

/** Merge, deduplicate, and return phones/emails across all pages. */
function mergeContact(
  pages: CrawlResult["pages"],
  field: "phones" | "emails",
): string[] {
  // Homepage first so it takes priority in deduplication order
  const seen = new Set<string>();
  const result: string[] = [];
  for (const page of pages) {
    for (const value of page[field]) {
      const normalized = value.trim().toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        result.push(value.trim());
      }
    }
  }
  return result;
}

/** Extract the first UK postcode found across all pages (homepage first). */
function extractAddress(pages: CrawlResult["pages"]): string | null {
  for (const page of pages) {
    const combined = `${page.title} ${page.metaDescription} ${page.bodyText}`;
    const matches = combined.match(UK_POSTCODE_REGEX);
    if (matches && matches.length > 0) {
      return matches[0].toUpperCase();
    }
  }
  return null;
}

/** Match service keywords for the given industry against all page body texts. */
function extractServices(
  pages: CrawlResult["pages"],
  industry: string,
): string[] {
  const keywords = INDUSTRY_KEYWORDS[industry.toLowerCase()] ?? [];
  if (keywords.length === 0) return [];

  const allText = pages.map((p) => p.bodyText.toLowerCase()).join(" ");

  const matched = new Set<string>();
  for (const keyword of keywords) {
    if (allText.includes(keyword.toLowerCase())) {
      matched.add(keyword);
    }
  }
  return Array.from(matched);
}

/**
 * Detect testimonial-like paragraphs from all page body texts.
 * Returns up to 5 matching paragraphs.
 */
function extractTestimonials(pages: CrawlResult["pages"]): string[] {
  const testimonials: string[] = [];

  for (const page of pages) {
    // Split into paragraphs (double newline or single newline)
    const paragraphs = page.bodyText
      .split(/\n{1,2}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20);

    for (const para of paragraphs) {
      if (testimonials.length >= 5) break;

      // Quoted text
      if (/^["'"']/.test(para) || /["'"']$/.test(para)) {
        testimonials.push(para);
        continue;
      }

      // Review-like patterns
      if (TESTIMONIAL_PATTERNS.some((rx) => rx.test(para))) {
        testimonials.push(para);
        continue;
      }

      // Preceded by attribution pattern like "— John S." (check last sentence)
      if (/—\s*[A-Z][a-z]/.test(para)) {
        testimonials.push(para);
        continue;
      }
    }

    if (testimonials.length >= 5) break;
  }

  return testimonials;
}

/** Collect h1/h2 headings from the homepage only. */
function extractHeadings(pages: CrawlResult["pages"]): string[] {
  const homepage = pages[0];
  if (!homepage) return [];

  const h1s = homepage.headings["h1"] ?? [];
  const h2s = homepage.headings["h2"] ?? [];
  return [...h1s, ...h2s].map((h) => h.trim()).filter(Boolean);
}

/** Collect all unique image URLs across all pages. */
function extractImageUrls(pages: CrawlResult["pages"]): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const page of pages) {
    for (const img of page.images) {
      if (img.src && !seen.has(img.src)) {
        seen.add(img.src);
        urls.push(img.src);
      }
    }
  }
  return urls;
}

/** Rough token estimate: sum of all body text lengths divided by 4. */
function estimateTokens(pages: CrawlResult["pages"]): number {
  const totalChars = pages.reduce((acc, p) => acc + p.bodyText.length, 0);
  return Math.ceil(totalChars / 4);
}

/**
 * Programmatic data extraction from a crawl result.
 * Runs without any API calls — pure TypeScript.
 */
export function extractBusinessData(
  crawlResult: CrawlResult,
  inputData: ProspectInputData,
): ExtractedData {
  const { pages } = crawlResult;

  const businessName = extractBusinessName(pages, inputData.business_name);
  const phones = mergeContact(pages, "phones");
  const emails = mergeContact(pages, "emails");
  const address = extractAddress(pages);
  const services = extractServices(pages, inputData.industry);
  const testimonials = extractTestimonials(pages);
  const headings = extractHeadings(pages);
  const imageUrls = extractImageUrls(pages);
  const totalTokenEstimate = estimateTokens(pages);

  return {
    businessName,
    phones,
    emails,
    address,
    services,
    testimonials,
    headings,
    imageUrls,
    totalTokenEstimate,
  };
}
