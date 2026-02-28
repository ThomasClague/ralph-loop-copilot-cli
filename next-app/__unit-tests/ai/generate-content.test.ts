import { describe, expect, it, vi, beforeEach } from "vitest";
import type {
  CondensedProfile,
  StructureDecision,
} from "../../src/lib/ai/schemas";

vi.mock("../../src/lib/ai/client", () => ({
  model: "mock-model",
}));

const mockGenerateObject = vi.fn();
vi.mock("ai", () => ({
  generateObject: mockGenerateObject,
}));

const { generateContent } = await import("../../src/lib/ai/generate-content");
const { buildContentPrompt } = await import("../../src/lib/ai/prompts");

const testProfile: CondensedProfile = {
  businessName: "Smith Roofing Ltd",
  phones: ["01234 567890"],
  emails: ["info@smithroofing.co.uk"],
  address: "SW1A 1AA",
  services: ["new roofs", "repairs", "guttering"],
  testimonials: ["Excellent work by the Smith team!", "Fast and reliable."],
  uniquePoints: ["25 years experience", "Guaranteed workmanship"],
  yearsInBusiness: 25,
  summary:
    "Smith Roofing Ltd provides expert roofing services across London with 25 years of experience.",
};

const testStructure: StructureDecision = {
  sections: [
    { type: "hero", variant: "hero-centered", reasoning: "First" },
    { type: "services", variant: "services-grid", reasoning: "Core offering" },
    { type: "about", variant: "about-left", reasoning: "Story" },
    { type: "contact", variant: "contact-form", reasoning: "Last" },
  ],
  tone: "trustworthy",
  paletteHint: "deep blue",
};

const testProspect = {
  businessName: "Smith Roofing Ltd",
  industry: "roofing",
  location: "London",
};

const mockContentResult = {
  hero: {
    headline: "London's Most Trusted Roofers — 25 Years of Excellence",
    subheadline: "From Hackney to Hammersmith, we protect homes across London.",
    ctaText: "Get a Free Quote",
    ctaHref: "#contact",
  },
  services: {
    headline: "Our Roofing Services",
    items: [
      {
        title: "New Roofs",
        description: "Full roof installations.",
        icon: "home",
      },
      { title: "Repairs", description: "Fast leak repairs.", icon: "wrench" },
    ],
  },
  about: {
    headline: "25 Years Protecting London Homes",
    body: "Founded in 1999, Smith Roofing has served thousands of London homeowners.",
  },
  contact: {
    headline: "Contact Us Today",
    showForm: true,
    showMap: true,
  },
};

describe("generateContent", () => {
  beforeEach(() => {
    mockGenerateObject.mockReset();
  });

  it("returns a SiteSection array with one entry per structure section", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: mockContentResult });

    const result = await generateContent(
      testStructure,
      testProfile,
      testProspect,
    );

    expect(result).toHaveLength(4);
    expect(result[0].type).toBe("hero");
    expect(result[1].type).toBe("services");
    expect(result[2].type).toBe("about");
    expect(result[3].type).toBe("contact");
  });

  it("assigns correct id, variant, and visible flag to each section", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: mockContentResult });

    const result = await generateContent(
      testStructure,
      testProfile,
      testProspect,
    );

    expect(result[0].id).toBe("hero-0");
    expect(result[0].variant).toBe("hero-centered");
    expect(result[0].visible).toBe(true);
    expect(result[3].id).toBe("contact-3");
    expect(result[3].variant).toBe("contact-form");
  });

  it("attaches generated content to each section", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: mockContentResult });

    const result = await generateContent(
      testStructure,
      testProfile,
      testProspect,
    );

    expect(result[0].content).toMatchObject({
      headline: "London's Most Trusted Roofers — 25 Years of Excellence",
    });
    expect(result[3].content).toMatchObject({ showForm: true });
  });

  it("falls back to empty object when AI does not generate content for a section", async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: { hero: mockContentResult.hero },
    });

    const result = await generateContent(
      testStructure,
      testProfile,
      testProspect,
    );

    expect(result[1].content).toEqual({});
    expect(result[2].content).toEqual({});
  });

  it("passes model, contentSchema, and prompt to generateObject", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: mockContentResult });

    await generateContent(testStructure, testProfile, testProspect);

    const args = mockGenerateObject.mock.calls[0][0];
    expect(args.model).toBe("mock-model");
    expect(args.schema).toBeDefined();
    expect(args.prompt).toContain("Smith Roofing Ltd");
  });
});

describe("buildContentPrompt", () => {
  it("includes businessName, industry, location", () => {
    const prompt = buildContentPrompt(testStructure, testProfile, testProspect);
    expect(prompt).toContain("Smith Roofing Ltd");
    expect(prompt).toContain("roofing");
    expect(prompt).toContain("London");
  });

  it("includes actual services from the profile", () => {
    const prompt = buildContentPrompt(testStructure, testProfile, testProspect);
    expect(prompt).toContain("new roofs");
    expect(prompt).toContain("repairs");
    expect(prompt).toContain("guttering");
  });

  it("includes tone from the structure decision", () => {
    const prompt = buildContentPrompt(testStructure, testProfile, testProspect);
    expect(prompt).toContain("trustworthy");
  });

  it("lists the sections to generate", () => {
    const prompt = buildContentPrompt(testStructure, testProfile, testProspect);
    expect(prompt).toContain("hero");
    expect(prompt).toContain("services");
    expect(prompt).toContain("contact");
  });

  it("includes testimonials from the profile", () => {
    const prompt = buildContentPrompt(testStructure, testProfile, testProspect);
    expect(prompt).toContain("Excellent work by the Smith team!");
  });
});
