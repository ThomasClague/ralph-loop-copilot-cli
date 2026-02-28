import { describe, expect, it } from "vitest";
import {
  assignVariants,
  SECTION_VARIANTS,
} from "../../src/lib/ai/assign-variants";
import type { SiteSection } from "../../src/types/site";

function makeSection(type: SiteSection["type"], variant = "centered"): SiteSection {
  return { id: `${type}-1`, type, variant, visible: true, content: {} as any };
}

describe("assignVariants", () => {
  it("returns the same number of sections", () => {
    const sections = [makeSection("hero"), makeSection("services")];
    const result = assignVariants(sections, "Acme Roofing", "roofing");
    expect(result).toHaveLength(2);
  });

  it("sets variant to a valid option for the section type", () => {
    const sections = [
      makeSection("hero"),
      makeSection("services"),
      makeSection("about"),
      makeSection("testimonials"),
      makeSection("faq"),
    ];
    const result = assignVariants(sections, "Test Co", "plumbing");
    for (const section of result) {
      const valid = SECTION_VARIANTS[section.type];
      expect(valid).toContain(section.variant);
    }
  });

  it("is deterministic — same inputs produce identical output", () => {
    const sections = [
      makeSection("hero"),
      makeSection("services"),
      makeSection("about"),
      makeSection("process"),
    ];
    const first = assignVariants(sections, "Brighton Plumbers", "plumbing");
    const second = assignVariants(sections, "Brighton Plumbers", "plumbing");
    expect(first.map((s) => s.variant)).toEqual(second.map((s) => s.variant));
  });

  it("different businessName produces at least one different variant", () => {
    // "A-test-" prefix has odd char-sum parity; "B-test-" prefix has even parity,
    // so every 2-variant section flips between the two businesses.
    const sections = [makeSection("hero"), makeSection("services")];
    const a = assignVariants(sections, "A", "test").map((s) => s.variant);
    const b = assignVariants(sections, "B", "test").map((s) => s.variant);
    const hasDiff = a.some((v, i) => v !== b[i]);
    expect(hasDiff).toBe(true);
  });

  it("does not mutate input sections", () => {
    const sections = [makeSection("hero", "centered")];
    assignVariants(sections, "Test", "test");
    expect(sections[0].variant).toBe("centered");
  });

  it("sections with single-variant types always get that variant", () => {
    const singleVariantTypes: SiteSection["type"][] = [
      "pricing",
      "team",
      "certifications",
      "emergency",
      "comparison",
      "brands",
      "blog_preview",
      "video",
      "guarantee",
    ];
    const sections = singleVariantTypes.map((t) => makeSection(t));
    const result = assignVariants(sections, "Any Co", "any");
    for (const section of result) {
      const expected = SECTION_VARIANTS[section.type][0];
      expect(section.variant).toBe(expected);
    }
  });

  it("preserves all other section fields", () => {
    const sections = [makeSection("hero")];
    const result = assignVariants(sections, "Test", "test");
    expect(result[0].id).toBe("hero-1");
    expect(result[0].type).toBe("hero");
    expect(result[0].visible).toBe(true);
  });
});
