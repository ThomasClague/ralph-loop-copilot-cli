import { describe, expect, it } from "vitest";
import { extractBusinessData } from "../../src/lib/ai/extract";
import type { CrawlResult } from "../../src/lib/scraping/types";

function makeCrawlResult(overrides: Partial<CrawlResult> = {}): CrawlResult {
  return {
    success: true,
    pages: [],
    branding: { colors: [], fonts: [], logoUrl: null },
    ...overrides,
  };
}

function makePage(
  overrides: Partial<CrawlResult["pages"][number]> = {},
): CrawlResult["pages"][number] {
  return {
    url: "https://example.com",
    title: "Test Company",
    metaDescription: "Test description",
    headings: { h1: ["Test Company"], h2: ["Our Services"] },
    bodyText: "Welcome to our site.",
    links: [],
    images: [],
    phones: [],
    emails: [],
    ...overrides,
  };
}

describe("extractBusinessData", () => {
  it("returns the fallback business name when no h1 found", () => {
    const result = extractBusinessData(
      makeCrawlResult({ pages: [makePage({ headings: {} })] }),
      { business_name: "Acme Ltd", industry: "roofing" },
    );
    expect(result.businessName).toBe("Acme Ltd");
  });

  it("extracts the most common h1 as business name", () => {
    const pages = [
      makePage({ headings: { h1: ["Acme Roofing"] } }),
      makePage({ headings: { h1: ["Acme Roofing"] } }),
      makePage({ headings: { h1: ["Other Title"] } }),
    ];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Fallback",
      industry: "roofing",
    });
    expect(result.businessName).toBe("Acme Roofing");
  });

  it("deduplicates phones and emails across pages", () => {
    const pages = [
      makePage({ phones: ["01234 567890"], emails: ["info@acme.com"] }),
      makePage({
        phones: ["01234 567890", "07999 000111"],
        emails: ["info@acme.com"],
      }),
    ];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Acme",
      industry: "plumbing",
    });
    expect(result.phones).toEqual(["01234 567890", "07999 000111"]);
    expect(result.emails).toEqual(["info@acme.com"]);
  });

  it("extracts UK postcode from body text", () => {
    const pages = [
      makePage({ bodyText: "We serve SW1A 1AA and surrounding areas." }),
    ];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Acme",
      industry: "roofing",
    });
    expect(result.address).toBe("SW1A 1AA");
  });

  it("returns null address when no postcode found", () => {
    const pages = [makePage({ bodyText: "No postcode here" })];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Acme",
      industry: "roofing",
    });
    expect(result.address).toBeNull();
  });

  it("matches roofing service keywords", () => {
    const pages = [
      makePage({
        bodyText: "We offer flat roof installation and guttering services.",
      }),
    ];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Acme",
      industry: "roofing",
    });
    expect(result.services).toContain("flat roof");
    expect(result.services).toContain("guttering");
  });

  it("returns empty services for unknown industry", () => {
    const pages = [makePage({ bodyText: "We do all sorts of work." })];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Acme",
      industry: "unknown_industry",
    });
    expect(result.services).toEqual([]);
  });

  it("detects testimonial-like paragraphs", () => {
    const pages = [
      makePage({
        bodyText:
          "Some intro text.\nHighly recommend this company for all your needs!\nAnother paragraph.",
      }),
    ];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Acme",
      industry: "roofing",
    });
    expect(result.testimonials.some((t) => /highly recommend/i.test(t))).toBe(
      true,
    );
  });

  it("detects quoted testimonials", () => {
    const pages = [
      makePage({
        bodyText: '"Amazing service from start to finish."',
      }),
    ];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Acme",
      industry: "roofing",
    });
    expect(result.testimonials.length).toBeGreaterThan(0);
  });

  it("extracts h1/h2 headings from homepage only", () => {
    const pages = [
      makePage({
        headings: { h1: ["Acme Roofing"], h2: ["Our Services", "Contact Us"] },
      }),
      makePage({
        headings: { h1: ["Inner Page H1"] },
      }),
    ];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Acme",
      industry: "roofing",
    });
    expect(result.headings).toContain("Acme Roofing");
    expect(result.headings).toContain("Our Services");
    expect(result.headings).not.toContain("Inner Page H1");
  });

  it("collects unique image URLs across all pages", () => {
    const pages = [
      makePage({ images: [{ src: "/img1.jpg", alt: "img1" }] }),
      makePage({
        images: [
          { src: "/img1.jpg", alt: "img1" },
          { src: "/img2.jpg", alt: "img2" },
        ],
      }),
    ];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Acme",
      industry: "roofing",
    });
    expect(result.imageUrls).toEqual(["/img1.jpg", "/img2.jpg"]);
  });

  it("calculates totalTokenEstimate as sum of body chars / 4", () => {
    const body = "a".repeat(400);
    const pages = [makePage({ bodyText: body })];
    const result = extractBusinessData(makeCrawlResult({ pages }), {
      business_name: "Acme",
      industry: "roofing",
    });
    expect(result.totalTokenEstimate).toBe(100);
  });

  it("returns empty data when crawl has no pages", () => {
    const result = extractBusinessData(makeCrawlResult({ pages: [] }), {
      business_name: "Acme",
      industry: "roofing",
    });
    expect(result.businessName).toBe("Acme");
    expect(result.phones).toEqual([]);
    expect(result.emails).toEqual([]);
    expect(result.address).toBeNull();
    expect(result.services).toEqual([]);
    expect(result.totalTokenEstimate).toBe(0);
  });
});
