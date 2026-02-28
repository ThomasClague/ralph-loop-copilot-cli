import { generateObject } from "ai";
import type { CrawlResult } from "../scraping/types";
import { model } from "./client";
import { condensationSchema, type CondensedProfile } from "./schemas";
import type { ExtractedData } from "./extract";

const TOKEN_THRESHOLD = 4000;

/**
 * Converts ExtractedData directly to a CondensedProfile without an API call.
 * Used when the scraped content is small enough that condensation is unnecessary.
 */
function extractedToCondensed(extractedData: ExtractedData): CondensedProfile {
  return {
    businessName: extractedData.businessName,
    phones: extractedData.phones,
    emails: extractedData.emails,
    address: extractedData.address ?? undefined,
    services: extractedData.services,
    testimonials: extractedData.testimonials,
    uniquePoints: [],
    yearsInBusiness: undefined,
    summary: extractedData.headings.join(". "),
  };
}

/**
 * Optionally condenses large scraped content into a structured CondensedProfile
 * using the Vercel AI SDK generateObject call.
 *
 * If the combined token estimate is under 4,000 tokens, no API call is made and
 * the extracted data is mapped directly to a CondensedProfile. Otherwise the AI
 * is asked to extract the key business information from the raw scraped text.
 */
export async function condenseBusinessData(
  extractedData: ExtractedData,
  crawlResult: CrawlResult,
  industry?: string,
): Promise<CondensedProfile> {
  if (extractedData.totalTokenEstimate < TOKEN_THRESHOLD) {
    return extractedToCondensed(extractedData);
  }

  const scrapedText = crawlResult.pages
    .map((page) => page.bodyText)
    .join("\n\n");

  const industryContext = industry
    ? ` The business operates in the ${industry} industry.`
    : "";

  const { object } = await generateObject({
    model,
    schema: condensationSchema,
    prompt: `Extract structured business information from this website content.${industryContext} Focus on: business name, services offered, contact info (phones and emails), testimonials/customer quotes, unique selling points, years in business, and a concise summary.

Website content:
${scrapedText}`,
  });

  return object;
}
