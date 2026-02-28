// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest";

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("../../src/db/repository", () => ({
  getProspectBySlug: vi.fn(),
}));

vi.mock("../../src/lib/ai/regenerate-section", () => ({
  regenerateSection: vi.fn(),
}));

import { getProspectBySlug } from "../../src/db/repository";
import { regenerateSection } from "../../src/lib/ai/regenerate-section";
import { POST } from "../../app/api/generate/prospect/[slug]/section/route";
import { NextRequest } from "next/server";
import type { SiteConfig } from "../../src/types/site";

// ── Helpers ────────────────────────────────────────────────────────────────

function buildRequest(slug: string, body: object) {
  return new NextRequest(
    `http://localhost:3000/api/generate/prospect/${slug}/section`,
    { method: "POST", body: JSON.stringify(body) },
  );
}

function makeParams(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

const mockSection = {
  id: "hero-1",
  type: "hero" as const,
  variant: "hero-centered",
  visible: true,
  content: {
    headline: "Old headline",
    subheadline: "",
    ctaText: "",
    ctaHref: "",
    imageUrl: "",
  },
};

const mockSiteConfig: SiteConfig = {
  slug: "acme-plumbing",
  businessInfo: {
    name: "Acme Plumbing",
    phone: "555-1234",
    email: "a@a.com",
    location: "Boston",
    industry: "plumbing",
  },
  sections: [mockSection],
  paletteId: "ocean",
};

function makeProspect(overrides = {}) {
  return {
    id: "prospect-1",
    slug: "acme-plumbing",
    businessName: "Acme Plumbing",
    status: "ready",
    siteConfig: mockSiteConfig,
    ...overrides,
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("POST /api/generate/prospect/[slug]/section", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(regenerateSection).mockResolvedValue({
      ...mockSection,
      content: {
        headline: "New headline",
        subheadline: "Sub",
        ctaText: "CTA",
        ctaHref: "/",
        imageUrl: "",
      },
    } as never);
  });

  it("returns 404 when prospect not found", async () => {
    vi.mocked(getProspectBySlug).mockResolvedValue(null as never);

    const res = await POST(
      buildRequest("unknown", { sectionType: "hero" }),
      makeParams("unknown"),
    );
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toMatch(/not found/i);
  });

  it("returns 400 when sectionType is missing", async () => {
    vi.mocked(getProspectBySlug).mockResolvedValue(makeProspect() as never);

    const res = await POST(
      buildRequest("acme-plumbing", {}),
      makeParams("acme-plumbing"),
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/sectionType/i);
  });

  it("returns 404 when section type not in siteConfig", async () => {
    vi.mocked(getProspectBySlug).mockResolvedValue(makeProspect() as never);

    const res = await POST(
      buildRequest("acme-plumbing", { sectionType: "pricing" }),
      makeParams("acme-plumbing"),
    );
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toMatch(/pricing/i);
  });

  it("regenerates section and returns updated content", async () => {
    vi.mocked(getProspectBySlug).mockResolvedValue(makeProspect() as never);

    const res = await POST(
      buildRequest("acme-plumbing", { sectionType: "hero" }),
      makeParams("acme-plumbing"),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(regenerateSection).toHaveBeenCalledWith("prospect-1", "hero-1");
    expect(body.section.content.headline).toBe("New headline");
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(getProspectBySlug).mockRejectedValue(
      new Error("DB error") as never,
    );

    const res = await POST(
      buildRequest("acme-plumbing", { sectionType: "hero" }),
      makeParams("acme-plumbing"),
    );
    expect(res.status).toBe(500);
  });
});
