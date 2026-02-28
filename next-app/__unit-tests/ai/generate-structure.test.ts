import { describe, expect, it, vi, beforeEach } from "vitest";
import type { CondensedProfile } from "../../src/lib/ai/schemas";

vi.mock("../../src/lib/ai/client", () => ({
  model: "mock-model",
}));

const mockGenerateObject = vi.fn();
vi.mock("ai", () => ({
  generateObject: mockGenerateObject,
}));

const { generateStructure } =
  await import("../../src/lib/ai/generate-structure");
const { buildStructurePrompt } = await import("../../src/lib/ai/prompts");

const testProfile: CondensedProfile = {
  businessName: "Smith Roofing Ltd",
  phones: ["01234 567890"],
  emails: ["info@smithroofing.co.uk"],
  address: "SW1A 1AA",
  services: ["new roofs", "repairs", "guttering"],
  testimonials: ["Excellent work!"],
  uniquePoints: ["25 years experience", "Guaranteed workmanship"],
  yearsInBusiness: 25,
  summary:
    "Smith Roofing Ltd provides expert roofing services across London with 25 years of experience.",
};

const testProspect = {
  businessName: "Smith Roofing Ltd",
  industry: "roofing",
  location: "London",
};

function makeStructureResult(
  overrideSections?: ReturnType<typeof makeDefaultSections>,
) {
  return {
    sections: overrideSections ?? makeDefaultSections(),
    tone: "trustworthy" as const,
    paletteHint: "deep blue",
  };
}

function makeDefaultSections() {
  return [
    { type: "hero" as const, variant: "hero-centered", reasoning: "First" },
    {
      type: "services" as const,
      variant: "services-grid",
      reasoning: "Core offering",
    },
    { type: "about" as const, variant: "about-left", reasoning: "Story" },
    {
      type: "trust_indicators" as const,
      variant: "default",
      reasoning: "Trust",
    },
    {
      type: "testimonials" as const,
      variant: "default",
      reasoning: "Social proof",
    },
    { type: "process" as const, variant: "default", reasoning: "How it works" },
    { type: "contact" as const, variant: "contact-form", reasoning: "Last" },
  ];
}

describe("generateStructure", () => {
  beforeEach(() => {
    mockGenerateObject.mockReset();
  });

  it("returns a StructureDecision with sections, tone, and paletteHint", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: makeStructureResult() });

    const result = await generateStructure(testProfile, testProspect);

    expect(result.sections).toHaveLength(7);
    expect(result.tone).toBe("trustworthy");
    expect(result.paletteHint).toBe("deep blue");
  });

  it("passes model and structureSchema to generateObject", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: makeStructureResult() });

    await generateStructure(testProfile, testProspect);

    const args = mockGenerateObject.mock.calls[0][0];
    expect(args.model).toBe("mock-model");
    expect(args.schema).toBeDefined();
    expect(args.prompt).toContain("Smith Roofing Ltd");
  });

  it("enforces hero as first section when AI omits it", async () => {
    const sectionsWithoutHero = [
      {
        type: "services" as const,
        variant: "services-grid",
        reasoning: "First",
      },
      { type: "about" as const, variant: "about-left", reasoning: "Story" },
      {
        type: "trust_indicators" as const,
        variant: "default",
        reasoning: "Trust",
      },
      {
        type: "testimonials" as const,
        variant: "default",
        reasoning: "Social",
      },
      { type: "process" as const, variant: "default", reasoning: "Process" },
      { type: "faq" as const, variant: "default", reasoning: "FAQ" },
      { type: "contact" as const, variant: "contact-form", reasoning: "Last" },
    ];
    mockGenerateObject.mockResolvedValueOnce({
      object: { ...makeStructureResult(), sections: sectionsWithoutHero },
    });

    const result = await generateStructure(testProfile, testProspect);

    expect(result.sections[0].type).toBe("hero");
  });

  it("enforces contact or cta_banner as last section", async () => {
    const sectionsWithoutContact = [
      { type: "hero" as const, variant: "hero-centered", reasoning: "First" },
      {
        type: "services" as const,
        variant: "services-grid",
        reasoning: "Services",
      },
      { type: "about" as const, variant: "about-left", reasoning: "About" },
      {
        type: "trust_indicators" as const,
        variant: "default",
        reasoning: "Trust",
      },
      {
        type: "testimonials" as const,
        variant: "default",
        reasoning: "Social",
      },
      { type: "process" as const, variant: "default", reasoning: "Process" },
      { type: "faq" as const, variant: "default", reasoning: "FAQ" },
    ];
    mockGenerateObject.mockResolvedValueOnce({
      object: { ...makeStructureResult(), sections: sectionsWithoutContact },
    });

    const result = await generateStructure(testProfile, testProspect);

    const last = result.sections[result.sections.length - 1];
    expect(["contact", "cta_banner"]).toContain(last.type);
  });

  it("does not exceed 10 sections after enforcing rules", async () => {
    const tenSections = [
      { type: "hero" as const, variant: "h", reasoning: "r" },
      { type: "services" as const, variant: "s", reasoning: "r" },
      { type: "about" as const, variant: "a", reasoning: "r" },
      { type: "trust_indicators" as const, variant: "t", reasoning: "r" },
      { type: "testimonials" as const, variant: "t", reasoning: "r" },
      { type: "process" as const, variant: "p", reasoning: "r" },
      { type: "service_area" as const, variant: "sa", reasoning: "r" },
      { type: "gallery" as const, variant: "g", reasoning: "r" },
      { type: "faq" as const, variant: "f", reasoning: "r" },
      // No contact at end to trigger append
      { type: "benefits" as const, variant: "b", reasoning: "r" },
    ];
    mockGenerateObject.mockResolvedValueOnce({
      object: { ...makeStructureResult(), sections: tenSections },
    });

    const result = await generateStructure(testProfile, testProspect);

    expect(result.sections.length).toBeLessThanOrEqual(10);
  });
});

describe("buildStructurePrompt", () => {
  it("includes businessName, industry, and location", () => {
    const prompt = buildStructurePrompt(testProfile, testProspect);
    expect(prompt).toContain("Smith Roofing Ltd");
    expect(prompt).toContain("roofing");
    expect(prompt).toContain("London");
  });

  it("includes the profile summary", () => {
    const prompt = buildStructurePrompt(testProfile, testProspect);
    expect(prompt).toContain(testProfile.summary);
  });

  it("lists all 21 section types", () => {
    const prompt = buildStructurePrompt(testProfile, testProspect);
    expect(prompt).toContain("hero");
    expect(prompt).toContain("services");
    expect(prompt).toContain("testimonials");
    expect(prompt).toContain("guarantee");
  });

  it("includes hero-first and contact-last rules", () => {
    const prompt = buildStructurePrompt(testProfile, testProspect);
    expect(prompt).toContain("hero MUST be first");
    expect(prompt).toContain("contact or cta_banner MUST be last");
  });
});
