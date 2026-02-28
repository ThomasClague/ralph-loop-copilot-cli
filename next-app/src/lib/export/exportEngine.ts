/**
 * Export Engine — generates a standalone ZIP of a prospect's site.
 *
 * Flow:
 *  1. Load base template files (index.html, styles.css, scripts.js)
 *  2. Render each visible section from its HTML snippet template
 *  3. Replace all {{token}} / {{#if}} / {{#each}} placeholders with real content
 *  4. Inject palette CSS custom properties into the :root {} block
 *  5. Download all referenced images and embed them under images/
 *  6. Build a ZIP archive and write it to public/exports/{slug}.zip
 *  7. Return the export URL path
 */

import fs from "fs";
import path from "path";
import JSZip from "jszip";
import type { Prospect } from "../../db/repository";
import { loadPalette } from "../palettes";
import type { SiteConfig, SiteSection } from "../../types/site";

const TEMPLATES_DIR = path.join(process.cwd(), "src/templates/site");
const SECTIONS_DIR = path.join(TEMPLATES_DIR, "sections");
const EXPORTS_DIR = path.join(process.cwd(), "public/exports");

/** Tiny 1×1 gray PNG used as fallback when an image download fails. */
const PLACEHOLDER_PNG_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// ─── Template renderer ────────────────────────────────────────────────────────

/**
 * Render a Handlebars-style template string against a plain data object.
 * Handles: {{#each arr}}…{{/each}}, {{#if key}}…{{/if}}, {{token}}.
 */
function renderTemplate(
  template: string,
  data: Record<string, unknown>,
): string {
  // {{#each key}}…{{/each}} — iterate an array, render inner block per item
  template = template.replace(
    /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_, key: string, block: string) => {
      const items = data[key];
      if (!Array.isArray(items) || items.length === 0) return "";
      return items
        .map((item: unknown) => {
          const ctx = { ...(item as Record<string, unknown>) };
          // Compute star rating string so templates can use {{stars}}
          if (typeof ctx.rating === "number") {
            ctx.stars =
              "★".repeat(ctx.rating) + "☆".repeat(Math.max(0, 5 - ctx.rating));
          }
          return renderTemplate(block, ctx);
        })
        .join("");
    },
  );

  // {{#if key}}…{{/if}} — render inner block only when value is truthy
  template = template.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key: string, block: string) => {
      const value = data[key];
      if (!value) return "";
      return renderTemplate(block, data);
    },
  );

  // {{token}} — replace with string value (empty string for missing/null)
  template = template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = data[key];
    if (value === undefined || value === null) return "";
    return String(value);
  });

  return template;
}

// ─── Section rendering ────────────────────────────────────────────────────────

/**
 * Load and render a section HTML snippet for a given section type.
 * Falls back to an empty string if no snippet file exists for the type.
 */
function renderSection(
  section: SiteSection,
  globalData: Record<string, unknown>,
): string {
  const snippetPath = path.join(SECTIONS_DIR, `${section.type}.html`);
  if (!fs.existsSync(snippetPath)) return "";

  const snippet = fs.readFileSync(snippetPath, "utf-8");
  const content = section.content as unknown as Record<string, unknown>;

  // Merge global data (phone, businessName, etc.) into section context
  const ctx: Record<string, unknown> = { ...globalData, ...content };

  return renderTemplate(snippet, ctx);
}

// ─── Palette injection ────────────────────────────────────────────────────────

/**
 * Map palette tokens to the CSS variable names used by styles.css.
 * Palette uses verbose names; template CSS uses shorter aliases for some vars.
 */
const PALETTE_TO_CSS: Record<string, string> = {
  "--color-background": "--bg",
  "--color-surface": "--bg-alt",
  "--color-text-primary": "--text",
  "--color-text-secondary": "--text-muted",
  "--color-border": "--border",
};

/**
 * Replace the :root { } block in a CSS string with new palette-derived values.
 */
function injectPalette(
  css: string,
  tokens: Record<string, string>,
): string {
  // Build merged token map: start with defaults, overlay palette entries
  const vars: Record<string, string> = {
    "--radius": "8px",
    "--font-heading": "system-ui, -apple-system, sans-serif",
    "--font-body": "system-ui, -apple-system, sans-serif",
    "--shadow": "0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.08)",
    "--shadow-lg": "0 10px 25px rgba(0,0,0,.12)",
    "--max-width": "1200px",
  };

  for (const [k, v] of Object.entries(tokens)) {
    vars[k] = v;
    // Also add the short-alias form if a mapping exists
    const alias = PALETTE_TO_CSS[k];
    if (alias) vars[alias] = v;
  }

  const rootBlock =
    ":root {\n" +
    Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n") +
    "\n}";

  // Replace the existing :root { … } block (may span multiple lines)
  return css.replace(/:root\s*\{[\s\S]*?\}/, rootBlock);
}

// ─── Image handling ───────────────────────────────────────────────────────────

/** Download a single image with a 10-second timeout. Returns Buffer or null. */
async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

/** Derive a safe filename from a URL. */
function imageFilename(url: string, index: number): string {
  try {
    const u = new URL(url);
    const base = path.basename(u.pathname).replace(/[^a-zA-Z0-9._-]/g, "_");
    // Ensure unique filenames by prepending index
    return `${index}-${base || "image.jpg"}`;
  } catch {
    return `${index}-image.jpg`;
  }
}

/**
 * Find all external image URLs in the HTML, download them, add to the ZIP
 * under images/, and rewrite the HTML src attributes to relative paths.
 */
async function embedImages(
  html: string,
  zip: JSZip,
): Promise<string> {
  // Collect all unique http(s) URLs from src="..." attributes
  const srcPattern = /src="(https?:\/\/[^"]+)"/g;
  const uniqueUrls = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = srcPattern.exec(html)) !== null) {
    uniqueUrls.add(match[1]);
  }

  const fallback = Buffer.from(PLACEHOLDER_PNG_B64, "base64");
  const urlToFilename = new Map<string, string>();
  let i = 0;

  for (const url of uniqueUrls) {
    const filename = imageFilename(url, i++);
    const data = await downloadImage(url);
    zip.file(`images/${filename}`, data ?? fallback);
    urlToFilename.set(url, filename);
  }

  // Rewrite src attributes to relative paths
  return html.replace(/src="(https?:\/\/[^"]+)"/g, (_, url: string) => {
    const filename = urlToFilename.get(url);
    return filename ? `src="images/${filename}"` : `src=""`;
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate a static ZIP export for the given prospect.
 * Writes the file to public/exports/{slug}.zip and returns the public URL path.
 */
export async function generateExport(prospect: Prospect): Promise<string> {
  if (!prospect.siteConfig) {
    throw new Error("Prospect has no generated siteConfig");
  }

  const siteConfig: SiteConfig =
    typeof prospect.siteConfig === "string"
      ? (JSON.parse(prospect.siteConfig) as SiteConfig)
      : (prospect.siteConfig as unknown as SiteConfig);
  const { businessInfo, sections, paletteId, customPalette } = siteConfig;

  // ── 1. Load base template files ──────────────────────────────────────────
  const indexTemplate = fs.readFileSync(
    path.join(TEMPLATES_DIR, "index.html"),
    "utf-8",
  );
  const cssTemplate = fs.readFileSync(
    path.join(TEMPLATES_DIR, "styles.css"),
    "utf-8",
  );
  const jsTemplate = fs.readFileSync(
    path.join(TEMPLATES_DIR, "scripts.js"),
    "utf-8",
  );

  // ── 2. Resolve palette tokens ────────────────────────────────────────────
  let paletteTokens: Record<string, string>;
  if (customPalette && Object.keys(customPalette).length > 0) {
    paletteTokens = customPalette;
  } else {
    try {
      paletteTokens = loadPalette(paletteId).tokens;
    } catch {
      // If palette not found, use empty (CSS defaults will remain)
      paletteTokens = {};
    }
  }

  // ── 3. Inject palette into CSS ───────────────────────────────────────────
  const finalCss = injectPalette(cssTemplate, paletteTokens);

  // ── 4. Render visible sections ───────────────────────────────────────────
  const globalData: Record<string, unknown> = {
    businessName: businessInfo.name,
    phone: businessInfo.phone ?? "",
    email: businessInfo.email ?? "",
    location: businessInfo.location ?? "",
  };

  const sectionsHtml = sections
    .filter((s: SiteSection) => s.visible)
    .map((s: SiteSection) => renderSection(s, globalData))
    .join("\n\n");

  // ── 5. Build final HTML ───────────────────────────────────────────────────
  const topLevelData: Record<string, unknown> = {
    ...globalData,
    metaDescription: `${businessInfo.name} — ${businessInfo.industry} serving ${businessInfo.location}`,
    sections: sectionsHtml,
    year: new Date().getFullYear(),
  };

  let finalHtml = renderTemplate(indexTemplate, topLevelData);

  // ── 6. Embed images into ZIP ─────────────────────────────────────────────
  const zip = new JSZip();
  finalHtml = await embedImages(finalHtml, zip);

  // ── 7. Add all files to ZIP ───────────────────────────────────────────────
  zip.file("index.html", finalHtml);
  zip.file("styles.css", finalCss);
  zip.file("scripts.js", jsTemplate);

  // ── 8. Write ZIP to public/exports/ ─────────────────────────────────────
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  const fileName = `${prospect.slug}.zip`;
  fs.writeFileSync(path.join(EXPORTS_DIR, fileName), zipBuffer);

  return `/exports/${fileName}`;
}
