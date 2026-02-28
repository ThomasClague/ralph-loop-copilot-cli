import * as cheerio from "cheerio";
import type { BrandingData } from "./types";

const GENERIC_FAMILIES = new Set([
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "-apple-system",
  "blinkmacsystemfont",
  "segoe ui",
  "helvetica neue",
  "arial",
  "helvetica",
  "times new roman",
  "georgia",
  "courier new",
  "inherit",
  "initial",
  "unset",
]);

/** Convert r,g,b (0-255) integers to a 6-char hex string like "#2563eb". */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toLowerCase()
  );
}

/** Expand a 3-char hex like "fff" → "ffffff". */
function normaliseHex(hex: string): string {
  if (hex.length === 3) {
    return hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  // 4/8-char (with alpha) — drop alpha component
  if (hex.length === 4) {
    return hex
      .slice(0, 3)
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (hex.length === 8) {
    return hex.slice(0, 6);
  }
  return hex.slice(0, 6);
}

/** Compute relative luminance (0–1) from hex. */
function luminance(hex: string): number {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const linear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Return true if the color is too close to white or black to be a brand color. */
function isTrivialColor(hex6: string): boolean {
  const lum = luminance(hex6);
  return lum > 0.9 || lum < 0.05;
}

/**
 * Extracts brand colors, font names, and logo URL from raw homepage HTML.
 * Uses regex on the raw string (before Cheerio strips <style> tags).
 */
export function extractBranding(rawHtml: string, pageUrl: string): BrandingData {
  const colors = extractColors(rawHtml);
  const fonts = extractFonts(rawHtml);
  const logoUrl = extractLogo(rawHtml, pageUrl);
  return { colors, fonts, logoUrl };
}

function extractColors(rawHtml: string): string[] {
  const seen = new Set<string>();

  // Hex colors
  const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
  let m: RegExpExecArray | null;
  while ((m = hexRe.exec(rawHtml)) !== null) {
    const raw = m[1];
    if (raw.length === 3 || raw.length === 4 || raw.length === 6 || raw.length === 8) {
      seen.add(normaliseHex(raw.toLowerCase()));
    }
  }

  // RGB colors
  const rgbRe = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi;
  while ((m = rgbRe.exec(rawHtml)) !== null) {
    seen.add(
      rgbToHex(parseInt(m[1]), parseInt(m[2]), parseInt(m[3])).slice(1),
    );
  }

  const filtered = [...seen]
    .filter((hex) => hex.length === 6 && !isTrivialColor(hex))
    .map((hex) => "#" + hex);

  return filtered.slice(0, 5);
}

function extractFonts(rawHtml: string): string[] {
  const seen = new Set<string>();

  // CSS font-family declarations
  const declRe = /font-family\s*:\s*([^;"{}<>]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = declRe.exec(rawHtml)) !== null) {
    const families = m[1].split(",");
    for (const family of families) {
      const clean = family.trim().replace(/['"]/g, "").toLowerCase();
      if (clean && !GENERIC_FAMILIES.has(clean)) {
        seen.add(clean);
      }
    }
  }

  // Google Fonts URL: family=Open+Sans|Roboto or family=Open+Sans&family=Roboto
  const gfRe = /fonts\.googleapis\.com\/css[^"']*[?&]family=([^"'& ]+)/gi;
  while ((m = gfRe.exec(rawHtml)) !== null) {
    const familyParam = decodeURIComponent(m[1]);
    // Handle pipe-separated or colon-separated (for weights) families
    const families = familyParam.split(/[|,]/);
    for (const fam of families) {
      const name = fam.split(":")[0].replace(/\+/g, " ").trim().toLowerCase();
      if (name && !GENERIC_FAMILIES.has(name)) {
        seen.add(name);
      }
    }
  }

  return [...seen];
}

function extractLogo(rawHtml: string, pageUrl: string): string | null {
  const $ = cheerio.load(rawHtml);

  /** Resolve a potentially-relative src to an absolute URL. */
  function resolve(src: string): string | null {
    if (!src) return null;
    try {
      return new URL(src, pageUrl).href;
    } catch {
      return null;
    }
  }

  // 1. img inside <header> or element with header-like class/id
  const headerEl = $("header, [class*='header'], [id*='header'], [class*='navbar'], [id*='navbar']");
  const headerImg = headerEl.find("img").first();
  if (headerImg.length) {
    const src = resolve(headerImg.attr("src") || "");
    if (src) return src;
  }

  // 2. img with 'logo' in src / alt / class / id
  let logoSrc: string | null = null;
  $("img").each((_, el) => {
    if (logoSrc) return;
    const src = $(el).attr("src") || "";
    const alt = ($(el).attr("alt") || "").toLowerCase();
    const cls = ($(el).attr("class") || "").toLowerCase();
    const id = ($(el).attr("id") || "").toLowerCase();
    if (
      src.toLowerCase().includes("logo") ||
      alt.includes("logo") ||
      cls.includes("logo") ||
      id.includes("logo")
    ) {
      logoSrc = resolve(src);
    }
  });

  return logoSrc;
}
