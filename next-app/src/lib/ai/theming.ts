import { listPalettes } from "../palettes";
import type { BrandingData } from "../../scraper/types";

export interface ThemeSelection {
  paletteId: string;
  customPalette?: Record<string, string>;
}

/** Parse hex color string to [r, g, b] channels (0-255). */
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!result) return null;
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

/** Convert RGB channels back to a lowercase hex string. */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

/** Darken a hex color by subtracting a percentage from each channel. */
function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 - percent / 100;
  return rgbToHex(rgb[0] * factor, rgb[1] * factor, rgb[2] * factor);
}

/** Lighten a hex color by mixing with white at the given percentage. */
function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = percent / 100;
  return rgbToHex(
    rgb[0] + (255 - rgb[0]) * factor,
    rgb[1] + (255 - rgb[1]) * factor,
    rgb[2] + (255 - rgb[2]) * factor,
  );
}

/** Returns true when perceived luminance is below 0.4 (dark color). */
function isDark(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const [r, g, b] = rgb.map((v) => v / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.4;
}

/**
 * Derive a full 21-token palette from a primary brand color.
 * Uses amber as the accent fallback when no second brand color is available.
 */
function deriveCustomPalette(
  primaryColor: string,
  accentColor?: string,
): Record<string, string> {
  const accent = accentColor ?? "#f59e0b";
  return {
    "--color-primary": primaryColor,
    "--color-primary-hover": darken(primaryColor, 10),
    "--color-primary-light": lighten(primaryColor, 90),
    "--color-primary-dark": darken(primaryColor, 20),
    "--color-secondary": "#0f172a",
    "--color-secondary-hover": "#1e293b",
    "--color-accent": accent,
    "--color-background": "#ffffff",
    "--color-surface": "#f8fafc",
    "--color-surface-alt": "#f1f5f9",
    "--color-text-primary": "#0f172a",
    "--color-text-secondary": "#475569",
    "--color-text-inverted": isDark(primaryColor) ? "#ffffff" : "#0f172a",
    "--color-border": "#e2e8f0",
    "--color-border-light": "#f1f5f9",
    "--color-heading": "#0f172a",
    "--color-link": primaryColor,
    "--color-success": "#16a34a",
    "--color-warning": "#d97706",
    "--color-error": "#dc2626",
    "--color-overlay": "rgba(0,0,0,0.5)",
  };
}

/** Keyword-to-palette-id mappings for hint string matching. */
const HINT_MAP: Array<{ keywords: string[]; paletteId: string }> = [
  { keywords: ["blue", "ocean", "sky", "azure"], paletteId: "ocean-blue" },
  { keywords: ["green", "forest", "nature", "eco"], paletteId: "forest-green" },
  { keywords: ["teal", "mint", "aqua"], paletteId: "teal-clean" },
  { keywords: ["indigo", "purple", "violet", "modern"], paletteId: "indigo-modern" },
  { keywords: ["amber", "orange", "trade", "yellow"], paletteId: "amber-trade" },
  { keywords: ["red", "crimson", "bold", "danger"], paletteId: "crimson-bold" },
  { keywords: ["slate", "professional", "corporate"], paletteId: "slate-professional" },
  { keywords: ["charcoal", "dark", "minimal", "black"], paletteId: "charcoal-minimal" },
];

/**
 * Select or derive the color palette for a generated site (Stage 6).
 *
 * - Brand colors present → derive a custom palette from the primary brand color.
 * - No brand colors → map the AI palette hint to the closest pre-built palette.
 * - Always returns a valid result (never undefined or throws).
 */
export function selectPalette(
  branding: BrandingData,
  paletteHint: string,
): ThemeSelection {
  // Brand-derived path: use the most prominent brand color as primary
  if (branding.colors.length > 0) {
    const primary = branding.colors[0];
    if (hexToRgb(primary)) {
      const accent = branding.colors[1] ?? undefined;
      return {
        paletteId: "custom",
        customPalette: deriveCustomPalette(primary, accent),
      };
    }
  }

  // Hint-matching path: substring-match against keyword map
  const hint = paletteHint.toLowerCase();
  const palettes = listPalettes();
  const availableIds = new Set(palettes.map((p) => p.id));

  for (const { keywords, paletteId } of HINT_MAP) {
    if (keywords.some((kw) => hint.includes(kw)) && availableIds.has(paletteId)) {
      return { paletteId };
    }
  }

  // Fallback: first available palette
  const first = palettes[0];
  return { paletteId: first.id };
}
