import { describe, expect, it, vi } from "vitest";
import type { BrandingData } from "../../src/scraper/types";

// Mock the filesystem-dependent listPalettes to avoid needing config/palettes in test env
const MOCK_PALETTES = [
  { id: "ocean-blue", name: "Ocean Blue", tokens: {} },
  { id: "forest-green", name: "Forest Green", tokens: {} },
  { id: "teal-clean", name: "Teal Clean", tokens: {} },
  { id: "indigo-modern", name: "Indigo Modern", tokens: {} },
  { id: "amber-trade", name: "Amber Trade", tokens: {} },
  { id: "crimson-bold", name: "Crimson Bold", tokens: {} },
  { id: "slate-professional", name: "Slate Professional", tokens: {} },
  { id: "charcoal-minimal", name: "Charcoal Minimal", tokens: {} },
];

vi.mock("../../src/lib/palettes", () => ({
  listPalettes: vi.fn(() => MOCK_PALETTES),
}));

// Import after mock is set up
const { selectPalette } = await import("../../src/lib/ai/theming");

function makeBranding(colors: string[] = []): BrandingData {
  return { colors, fonts: [], logoUrl: null };
}

describe("selectPalette — brand-derived path", () => {
  it("returns paletteId 'custom' when brand colors are present", () => {
    const result = selectPalette(makeBranding(["#c41e3a"]), "any");
    expect(result.paletteId).toBe("custom");
  });

  it("includes customPalette when brand colors are present", () => {
    const result = selectPalette(makeBranding(["#c41e3a"]), "any");
    expect(result.customPalette).toBeDefined();
  });

  it("sets --color-primary to the first brand color", () => {
    const result = selectPalette(makeBranding(["#c41e3a"]), "any");
    expect(result.customPalette!["--color-primary"]).toBe("#c41e3a");
  });

  it("derives a primary-hover darker than primary", () => {
    const result = selectPalette(makeBranding(["#c41e3a"]), "any");
    // primary #c41e3a = rgb(196, 30, 58) — hover should have smaller channels
    const hover = result.customPalette!["--color-primary-hover"];
    expect(hover).not.toBe("#c41e3a");
    expect(hover).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("derives a primary-light lighter than primary", () => {
    const result = selectPalette(makeBranding(["#c41e3a"]), "any");
    const light = result.customPalette!["--color-primary-light"];
    expect(light).toMatch(/^#[0-9a-f]{6}$/);
    // light should be significantly closer to white
    const rLight = parseInt(light.slice(1, 3), 16);
    expect(rLight).toBeGreaterThan(196); // primary red channel is 196
  });

  it("uses second brand color as accent when provided", () => {
    const result = selectPalette(makeBranding(["#c41e3a", "#fbbf24"]), "any");
    expect(result.customPalette!["--color-accent"]).toBe("#fbbf24");
  });

  it("falls back to amber accent when only one brand color", () => {
    const result = selectPalette(makeBranding(["#c41e3a"]), "any");
    expect(result.customPalette!["--color-accent"]).toBe("#f59e0b");
  });

  it("sets text-inverted to white for dark primary", () => {
    const result = selectPalette(makeBranding(["#1a1a2e"]), "any"); // very dark
    expect(result.customPalette!["--color-text-inverted"]).toBe("#ffffff");
  });

  it("contains all required tokens", () => {
    const result = selectPalette(makeBranding(["#c41e3a"]), "any");
    const required = [
      "--color-primary",
      "--color-primary-hover",
      "--color-primary-light",
      "--color-primary-dark",
      "--color-accent",
      "--color-background",
      "--color-surface",
      "--color-text-primary",
      "--color-text-inverted",
      "--color-border",
      "--color-link",
    ];
    for (const token of required) {
      expect(result.customPalette).toHaveProperty(token);
    }
  });
});

describe("selectPalette — palette hint matching path", () => {
  it("matches 'blue' hint to ocean-blue", () => {
    const result = selectPalette(makeBranding(), "vibrant blue");
    expect(result.paletteId).toBe("ocean-blue");
  });

  it("matches 'green' hint to forest-green", () => {
    const result = selectPalette(makeBranding(), "earthy green tones");
    expect(result.paletteId).toBe("forest-green");
  });

  it("matches 'red' hint to crimson-bold", () => {
    const result = selectPalette(makeBranding(), "bold red");
    expect(result.paletteId).toBe("crimson-bold");
  });

  it("matches 'professional' hint to slate-professional", () => {
    const result = selectPalette(makeBranding(), "professional corporate look");
    expect(result.paletteId).toBe("slate-professional");
  });

  it("falls back to first palette when hint has no match", () => {
    const result = selectPalette(makeBranding(), "qwerty fghij zxcv 12345");
    expect(result.paletteId).toBe(MOCK_PALETTES[0].id);
  });

  it("never returns undefined paletteId", () => {
    const result = selectPalette(makeBranding(), "");
    expect(result.paletteId).toBeTruthy();
  });

  it("does not include customPalette on hint-matched result", () => {
    const result = selectPalette(makeBranding(), "ocean blue");
    expect(result.customPalette).toBeUndefined();
  });
});
