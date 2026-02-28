import type { CheerioAPI } from "cheerio";
import type { PageData } from "./types";

const PHONE_REGEX =
  /(?:\+44|0)\s*\d[\d\s-]{8,14}\d|(?:\+1)?\s*\(?(\d{3})\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Extracts structured page data from a Cheerio-parsed page.
 * Strips nav/header/footer/scripts/styles before extracting body text.
 */
export function extractPageData(
  $: CheerioAPI,
  url: string,
  rawHtml: string,
): PageData {
  const title = $("title").text().trim();

  const metaDescription =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";

  const headings: Record<string, string[]> = {};
  for (const level of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
    headings[level] = $(level)
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);
  }

  // Clone body, remove noise, extract clean text
  $("script, style, nav, header, footer, [role='navigation']").remove();
  const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 10000);

  const links: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
      links.push(href);
    }
  });

  const images = $("img")
    .map((_, el) => ({
      src: $(el).attr("src") || "",
      alt: $(el).attr("alt") || "",
    }))
    .get()
    .filter((img) => img.src && !img.src.startsWith("data:"));

  const textForRegex = rawHtml;
  const phonesRaw = textForRegex.match(PHONE_REGEX) || [];
  const phones = [
    ...new Set(phonesRaw.map((p) => p.replace(/\s+/g, " ").trim())),
  ];

  const emailsRaw = textForRegex.match(EMAIL_REGEX) || [];
  const emails = [...new Set(emailsRaw)];

  return {
    url,
    title,
    metaDescription,
    headings,
    bodyText,
    links,
    images,
    phones,
    emails,
  };
}
