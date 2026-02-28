import fs from "fs";
import path from "path";

export interface Palette {
  id: string;
  name: string;
  tokens: Record<string, string>;
}

const PALETTES_DIR = path.join(process.cwd(), "config", "palettes");

/** Load all palette metadata (id + name) from config/palettes/ */
export function listPalettes(): Palette[] {
  const files = fs.readdirSync(PALETTES_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(PALETTES_DIR, file), "utf-8");
    return JSON.parse(raw) as Palette;
  });
}

/** Load a specific palette by id */
export function loadPalette(id: string): Palette {
  const filePath = path.join(PALETTES_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Palette not found: ${id}`);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Palette;
}

/** Returns the token map as React inline style-compatible object */
export function getPaletteStyles(palette: Palette): Record<string, string> {
  return palette.tokens;
}

/**
 * Apply palette CSS custom properties to a DOM element.
 * Client-side only — do not call from server components.
 */
export function applyPalette(paletteId: string, element: HTMLElement): void {
  const styles = getPaletteStyles(loadPalette(paletteId));
  Object.entries(styles).forEach(([prop, value]) => {
    element.style.setProperty(prop, value);
  });
}
