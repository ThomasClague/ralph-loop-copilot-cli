import { describe, expect, it, vi, beforeEach } from "vitest";
import type { CrawlResult } from "../../src/lib/scraping/types";
import type { ExtractedData } from "../../src/lib/ai/extract";

// Mock the AI client before importing condense
vi.mock("../../src/lib/ai/client", () => ({
  model: "mock-model",
}));

// Mock generateObject from ai
const mockGenerateObject = vi.fn();
vi.mock("ai", () => ({
  generateObject: mockGenerateObject,
}));

// Import after mocks
const { condenseBusinessData } = await import("../../src/lib/ai/condense");

function makeCrawlResult(bodyText = "Some content"): CrawlResult {
  return {
    success: true,
    pages: [
      {
        url: "https://example.com",
        title: "Test Company",
        metaDescription: "A test company",
        headings: { h1: ["Test Company"], h2: [] },
        bodyText,
        links: [],
        images: [],
        phones: ["01234 567890"],
        emails: ["info@test.com"],
      },
    ],
    branding: { colors: [], fonts: [], logoUrl: null },
  };
}

function makeExtractedData(totalTokenEstimate: number): ExtractedData {
  return {
    businessName: "Test Co",
    phones: ["01234 567890"],
    emails: ["info@test.com"],
    address: "SW1A 1AA",
    services: ["roofing", "repairs"],
    testimonials: ["Great service!"],
    headings: ["Test Co", "Our Services"],
    imageUrls: [],
    totalTokenEstimate,
  };
}

describe("condenseBusinessData", () => {
  beforeEach(() => {
    mockGenerateObject.mockReset();
  });

  it("returns mapped profile without API call when tokens < 4000", async () => {
    const extracted = makeExtractedData(3999);
    const crawl = makeCrawlResult();

    const result = await condenseBusinessData(extracted, crawl);

    expect(mockGenerateObject).not.toHaveBeenCalled();
    expect(result.businessName).toBe("Test Co");
    expect(result.phones).toEqual(["01234 567890"]);
    expect(result.emails).toEqual(["info@test.com"]);
    expect(result.services).toEqual(["roofing", "repairs"]);
    expect(result.testimonials).toEqual(["Great service!"]);
    expect(result.address).toBe("SW1A 1AA");
  });

  it("calls generateObject when tokens >= 4000", async () => {
    const mockProfile = {
      businessName: "AI Business",
      phones: ["01234 567890"],
      emails: ["ai@test.com"],
      address: "SW1A 1AA",
      services: ["roofing"],
      testimonials: [],
      uniquePoints: ["Expert team"],
      yearsInBusiness: 10,
      summary: "A great business.",
    };
    mockGenerateObject.mockResolvedValueOnce({ object: mockProfile });

    const extracted = makeExtractedData(4000);
    const crawl = makeCrawlResult("A".repeat(16000)); // large content

    const result = await condenseBusinessData(extracted, crawl);

    expect(mockGenerateObject).toHaveBeenCalledOnce();
    expect(result.businessName).toBe("AI Business");
    expect(result.summary).toBe("A great business.");
  });

  it("passes model from client to generateObject", async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {
        businessName: "Test",
        phones: [],
        emails: [],
        services: [],
        testimonials: [],
        uniquePoints: [],
        summary: "Test summary",
      },
    });

    const extracted = makeExtractedData(5000);
    const crawl = makeCrawlResult("B".repeat(20000));

    await condenseBusinessData(extracted, crawl);

    const callArgs = mockGenerateObject.mock.calls[0][0];
    expect(callArgs.model).toBe("mock-model");
    expect(callArgs.schema).toBeDefined();
    expect(callArgs.prompt).toContain("website content");
  });

  it("includes industry context in prompt when provided", async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {
        businessName: "Test",
        phones: [],
        emails: [],
        services: [],
        testimonials: [],
        uniquePoints: [],
        summary: "Test summary",
      },
    });

    const extracted = makeExtractedData(5000);
    const crawl = makeCrawlResult("C".repeat(20000));

    await condenseBusinessData(extracted, crawl, "roofing");

    const callArgs = mockGenerateObject.mock.calls[0][0];
    expect(callArgs.prompt).toContain("roofing");
  });

  it("early return maps address as undefined when null", async () => {
    const extracted = makeExtractedData(100);
    extracted.address = null;
    const crawl = makeCrawlResult();

    const result = await condenseBusinessData(extracted, crawl);

    expect(result.address).toBeUndefined();
  });
});
