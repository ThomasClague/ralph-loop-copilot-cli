import { describe, expect, it, vi, beforeEach } from "vitest";
import type { SiteConfig } from "../../src/types/site";
import type { CondensedProfile } from "../../src/lib/ai/schemas";

vi.mock("../../src/lib/ai/client", () => ({
  model: "mock-model",
}));

const mockGenerateObject = vi.fn();
vi.mock("ai", () => ({
  generateObject: mockGenerateObject,
}));

const mockGetProspect = vi.fn();
const mockUpdateProspect = vi.fn();
vi.mock("../../src/db/repository", () => ({
  getProspect: mockGetProspect,
  updateProspect: mockUpdateProspect,
}));

const { regenerateSection } =
  await import("../../src/lib/ai/regenerate-section");

const testCondensedProfile: CondensedProfile = {
  businessName: "Smith Roofing Ltd",
  phones: ["01234 567890"],
  emails: ["info@smithroofing.co.uk"],
  services: ["new roofs", "repairs"],
  testimonials: ["Great work!"],
  uniquePoints: ["25 years experience"],
  summary: "Smith Roofing Ltd provides expert roofing services across London.",
};

const testSiteConfig: SiteConfig = {
  slug: "smith-roofing",
  businessInfo: {
    name: "Smith Roofing Ltd",
    phone: "01234 567890",
    email: "info@smithroofing.co.uk",
    location: "London",
    industry: "roofing",
  },
  sections: [
    {
      id: "hero-0",
      type: "hero",
      variant: "hero-centered",
      visible: true,
      content: { headline: "Old headline" } as never,
    },
    {
      id: "services-1",
      type: "services",
      variant: "services-grid",
      visible: true,
      content: { headline: "Old services" } as never,
    },
  ],
  paletteId: "classic-blue",
};

const mockProspect = {
  id: "prospect-1",
  businessName: "Smith Roofing Ltd",
  industry: "roofing",
  location: "London",
  siteConfig: testSiteConfig,
  condensedProfile: testCondensedProfile,
};

describe("regenerateSection", () => {
  beforeEach(() => {
    mockGenerateObject.mockReset();
    mockGetProspect.mockReset();
    mockUpdateProspect.mockReset();
  });

  it("throws if prospect is not found", async () => {
    mockGetProspect.mockResolvedValueOnce(undefined);
    await expect(regenerateSection("missing-id", "hero-0")).rejects.toThrow(
      "Prospect not found: missing-id",
    );
  });

  it("throws if section is not found", async () => {
    mockGetProspect.mockResolvedValueOnce(mockProspect);
    await expect(
      regenerateSection("prospect-1", "nonexistent-section"),
    ).rejects.toThrow("Section not found: nonexistent-section");
  });

  it("calls generateObject with prompt containing business info", async () => {
    mockGetProspect.mockResolvedValueOnce(mockProspect);
    mockUpdateProspect.mockResolvedValueOnce(undefined);
    mockGenerateObject.mockResolvedValueOnce({
      object: { hero: { headline: "New headline" } },
    });

    await regenerateSection("prospect-1", "hero-0");

    const args = mockGenerateObject.mock.calls[0][0];
    expect(args.prompt).toContain("hero");
    expect(args.prompt).toContain("Smith Roofing Ltd");
    expect(args.prompt).toContain("London");
  });

  it("returns an updated SiteSection with new content", async () => {
    mockGetProspect.mockResolvedValueOnce(mockProspect);
    mockUpdateProspect.mockResolvedValueOnce(undefined);
    mockGenerateObject.mockResolvedValueOnce({
      object: { hero: { headline: "New generated headline" } },
    });

    const result = await regenerateSection("prospect-1", "hero-0");

    expect(result.id).toBe("hero-0");
    expect(result.type).toBe("hero");
    expect(result.variant).toBe("hero-centered");
    expect((result.content as { headline: string }).headline).toBe(
      "New generated headline",
    );
  });

  it("does not affect other sections — updateProspect receives all sections", async () => {
    mockGetProspect.mockResolvedValueOnce(mockProspect);
    mockUpdateProspect.mockResolvedValueOnce(undefined);
    mockGenerateObject.mockResolvedValueOnce({
      object: { hero: { headline: "Updated" } },
    });

    await regenerateSection("prospect-1", "hero-0");

    const [, updateData] = mockUpdateProspect.mock.calls[0] as [
      string,
      { siteConfig: SiteConfig },
    ];
    const saved = updateData.siteConfig as SiteConfig;
    expect(saved.sections).toHaveLength(2);
    // services section should be unchanged
    expect(saved.sections[1].id).toBe("services-1");
    expect((saved.sections[1].content as { headline: string }).headline).toBe(
      "Old services",
    );
  });

  it("falls back to empty object when AI returns nothing for the section type", async () => {
    mockGetProspect.mockResolvedValueOnce(mockProspect);
    mockUpdateProspect.mockResolvedValueOnce(undefined);
    mockGenerateObject.mockResolvedValueOnce({ object: {} });

    const result = await regenerateSection("prospect-1", "hero-0");

    expect(result.content).toEqual({});
  });
});
