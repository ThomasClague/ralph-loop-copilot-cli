import { describe, expect, it, vi, beforeEach } from "vitest";
import type { SiteConfig, SiteSection } from "../../src/types/site";
import type { Prospect } from "../../src/db/repository";

import type { SectionType } from "../../src/types/site";

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("../../src/db/repository", () => ({
  getProspect: vi.fn(),
  updateProspect: vi.fn(),
  updateProspectStatus: vi.fn(),
}));

vi.mock("../../src/lib/scraping/client", () => ({
  crawlUrl: vi.fn(),
}));

vi.mock("../../src/lib/ai/extract", () => ({
  extractBusinessData: vi.fn(),
}));

vi.mock("../../src/lib/ai/condense", () => ({
  condenseBusinessData: vi.fn(),
}));

vi.mock("../../src/lib/ai/generate-structure", () => ({
  generateStructure: vi.fn(),
}));

vi.mock("../../src/lib/ai/generate-content", () => ({
  generateContent: vi.fn(),
}));

vi.mock("../../src/lib/ai/assign-images", () => ({
  assignImages: vi.fn(),
}));

vi.mock("../../src/lib/ai/assign-variants", () => ({
  assignVariants: vi.fn(),
}));

vi.mock("../../src/lib/ai/theming", () => ({
  selectPalette: vi.fn(),
}));

// ── Import after mocks ─────────────────────────────────────────────────────

const { runPipeline } = await import("../../src/lib/pipeline");
const { getProspect, updateProspect, updateProspectStatus } =
  await import("../../src/db/repository");
const { crawlUrl } = await import("../../src/lib/scraping/client");
const { extractBusinessData } = await import("../../src/lib/ai/extract");
const { condenseBusinessData } = await import("../../src/lib/ai/condense");
const { generateStructure } =
  await import("../../src/lib/ai/generate-structure");
const { generateContent } = await import("../../src/lib/ai/generate-content");
const { assignImages } = await import("../../src/lib/ai/assign-images");
const { assignVariants } = await import("../../src/lib/ai/assign-variants");
const { selectPalette } = await import("../../src/lib/ai/theming");

// ── Test fixtures ──────────────────────────────────────────────────────────

const mockProspect: Prospect = {
  id: "prospect-1",
  batchId: "batch-1",
  slug: "acme-roofing",
  businessName: "Acme Roofing",
  industry: "roofing",
  location: "London",
  phone: "01234 567890",
  email: "info@acme.co.uk",
  existingUrl: "https://acme.co.uk",
  notes: null,
  status: "pending",
  scrapedRaw: null,
  scrapedBranding: null,
  extractedData: null,
  condensedProfile: null,
  structure: null,
  siteContent: null,
  siteConfig: null,
  customPalette: null,
  outreachSentAt: null,
  outreachRespondedAt: null,
  exportedAt: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const mockCrawlResult = {
  success: true,
  pages: [
    {
      url: "https://acme.co.uk",
      title: "Acme Roofing",
      metaDescription: "Expert roofing",
      headings: { h1: ["Acme Roofing"], h2: ["Our Services"] },
      bodyText: "We provide excellent roofing services.",
      links: [],
      images: [],
      phones: ["01234 567890"],
      emails: ["info@acme.co.uk"],
    },
  ],
  branding: { colors: ["#1a73e8"], fonts: ["Arial"], logoUrl: null },
};

const mockExtractedData = {
  businessName: "Acme Roofing",
  phones: ["01234 567890"],
  emails: ["info@acme.co.uk"],
  address: "SW1A 1AA",
  services: ["new roofs", "repairs"],
  testimonials: [],
  headings: ["Acme Roofing", "Our Services"],
  imageUrls: [],
  totalTokenEstimate: 100,
};

const mockCondensedProfile = {
  businessName: "Acme Roofing",
  phones: ["01234 567890"],
  emails: ["info@acme.co.uk"],
  address: "SW1A 1AA",
  services: ["new roofs", "repairs"],
  testimonials: [],
  uniquePoints: [],
  yearsInBusiness: undefined,
  summary: "Expert roofing in London.",
};

const mockStructure = {
  sections: [
    {
      type: "hero" as SectionType,
      variant: "centered",
      reasoning: "Hero first.",
    },
    {
      type: "contact" as SectionType,
      variant: "form",
      reasoning: "Contact last.",
    },
  ],
  tone: "professional" as const,
  paletteHint: "blue professional",
};

const mockSections: SiteSection[] = [
  {
    id: "hero-0",
    type: "hero",
    variant: "centered",
    visible: true,
    content: {
      headline: "Expert Roofing in London",
      subheadline: "Call us today",
      ctaText: "Get a Quote",
      ctaHref: "#contact",
      imageUrl: "",
    },
  },
  {
    id: "contact-1",
    type: "contact",
    variant: "form",
    visible: true,
    content: { headline: "Contact Us", showForm: true },
  },
];

const mockTheme = { paletteId: "ocean-blue", customPalette: undefined };

// ── Tests ──────────────────────────────────────────────────────────────────

describe("runPipeline", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getProspect).mockResolvedValue(mockProspect);
    vi.mocked(crawlUrl).mockResolvedValue(mockCrawlResult);
    vi.mocked(extractBusinessData).mockReturnValue(mockExtractedData);
    vi.mocked(condenseBusinessData).mockResolvedValue(mockCondensedProfile);
    vi.mocked(generateStructure).mockResolvedValue(mockStructure);
    vi.mocked(generateContent).mockResolvedValue(mockSections);
    vi.mocked(assignImages).mockResolvedValue(mockSections);
    vi.mocked(assignVariants).mockReturnValue(mockSections);
    vi.mocked(selectPalette).mockReturnValue(mockTheme);
    vi.mocked(updateProspect).mockResolvedValue(undefined);
    vi.mocked(updateProspectStatus).mockResolvedValue(undefined);
  });

  it("throws if prospect not found", async () => {
    vi.mocked(getProspect).mockResolvedValue(undefined);
    await expect(runPipeline("missing-id")).rejects.toThrow(
      "Prospect not found",
    );
  });

  it("runs all pipeline stages and returns SiteConfig", async () => {
    const result = await runPipeline("prospect-1");

    expect(result).toMatchObject<Partial<SiteConfig>>({
      slug: "acme-roofing",
      businessInfo: expect.objectContaining({ name: "Acme Roofing" }),
      paletteId: "ocean-blue",
    });
    expect(result.sections).toHaveLength(2);
  });

  it("calls crawlUrl when existingUrl is set", async () => {
    await runPipeline("prospect-1");
    expect(crawlUrl).toHaveBeenCalledWith("https://acme.co.uk");
  });

  it("skips crawlUrl when no existingUrl", async () => {
    vi.mocked(getProspect).mockResolvedValue({
      ...mockProspect,
      existingUrl: null,
    });
    await runPipeline("prospect-1");
    expect(crawlUrl).not.toHaveBeenCalled();
  });

  it("saves scraped data and updates status to analyzing", async () => {
    await runPipeline("prospect-1");
    expect(updateProspect).toHaveBeenCalledWith(
      "prospect-1",
      expect.objectContaining({ scrapedRaw: expect.anything() }),
    );
    expect(updateProspectStatus).toHaveBeenCalledWith("prospect-1", "scraping");
    expect(updateProspectStatus).toHaveBeenCalledWith(
      "prospect-1",
      "analyzing",
    );
  });

  it("saves intermediate data at each stage", async () => {
    await runPipeline("prospect-1");
    // extractedData
    expect(updateProspect).toHaveBeenCalledWith(
      "prospect-1",
      expect.objectContaining({ extractedData: expect.anything() }),
    );
    // condensedProfile
    expect(updateProspect).toHaveBeenCalledWith(
      "prospect-1",
      expect.objectContaining({ condensedProfile: expect.anything() }),
    );
    // structure
    expect(updateProspect).toHaveBeenCalledWith(
      "prospect-1",
      expect.objectContaining({ structure: expect.anything() }),
    );
    // siteContent
    expect(updateProspect).toHaveBeenCalledWith(
      "prospect-1",
      expect.objectContaining({ siteContent: expect.anything() }),
    );
    // siteConfig
    expect(updateProspect).toHaveBeenCalledWith(
      "prospect-1",
      expect.objectContaining({ siteConfig: expect.anything() }),
    );
  });

  it("updates status to ready on success", async () => {
    await runPipeline("prospect-1");
    expect(updateProspectStatus).toHaveBeenCalledWith("prospect-1", "ready");
  });

  it("sets status to failed and stores error note on pipeline error", async () => {
    vi.mocked(generateStructure).mockRejectedValue(new Error("AI timeout"));
    await expect(runPipeline("prospect-1")).rejects.toThrow("AI timeout");
    expect(updateProspectStatus).toHaveBeenCalledWith("prospect-1", "failed");
    expect(updateProspect).toHaveBeenCalledWith(
      "prospect-1",
      expect.objectContaining({ notes: expect.stringContaining("AI timeout") }),
    );
  });

  it("calls assignVariants with business name and industry", async () => {
    await runPipeline("prospect-1");
    expect(assignVariants).toHaveBeenCalledWith(
      mockSections,
      "Acme Roofing",
      "roofing",
    );
  });

  it("calls selectPalette with branding and paletteHint", async () => {
    await runPipeline("prospect-1");
    expect(selectPalette).toHaveBeenCalledWith(
      mockCrawlResult.branding,
      "blue professional",
    );
  });

  it("includes customPalette when theming returns one", async () => {
    vi.mocked(selectPalette).mockReturnValue({
      paletteId: "custom",
      customPalette: { "--color-primary": "#1a73e8" },
    });
    const result = await runPipeline("prospect-1");
    expect(result.customPalette).toEqual({ "--color-primary": "#1a73e8" });
  });
});
