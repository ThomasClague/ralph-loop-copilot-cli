"use client";

import type { Palette } from "@/src/lib/palettes";

interface PalettePickerProps {
  palettes: Palette[];
  selectedId: string;
  onSelect: (paletteId: string) => void;
}

/** Extract the 5 preview colors from a palette's token map. */
function getSwatchColors(tokens: Record<string, string>): string[] {
  return [
    tokens["--color-primary"] ?? "#888",
    tokens["--color-secondary"] ?? "#555",
    tokens["--color-accent"] ?? "#f59e0b",
    tokens["--color-background"] ?? "#fff",
    tokens["--color-text-primary"] ?? "#111",
  ];
}

/** Grid of color swatches for selecting a palette. Each swatch is 80×60px. */
export function PalettePicker({
  palettes,
  selectedId,
  onSelect,
}: PalettePickerProps) {
  return (
    <div className="p-3 border rounded-md">
      <p className="text-xs font-medium text-foreground mb-2">Color Palette</p>
      <div className="grid grid-cols-3 gap-2">
        {palettes.map((p) => {
          const colors = getSwatchColors(p.tokens);
          const isActive = p.id === selectedId;
          const primaryColor = p.tokens["--color-primary"] ?? "#888";

          return (
            <button
              key={p.id}
              title={p.name}
              onClick={() => onSelect(p.id)}
              style={
                isActive
                  ? { outline: `2px solid ${primaryColor}`, outlineOffset: "2px" }
                  : undefined
              }
              className={`flex flex-col rounded overflow-hidden border transition-all hover:shadow-md focus:outline-none ${
                isActive ? "border-transparent" : "border-border"
              }`}
            >
              {/* Color blocks */}
              <div className="flex h-[42px] w-full">
                {colors.map((color, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: color, flex: 1 }}
                    aria-hidden
                  />
                ))}
              </div>
              {/* Palette name */}
              <span className="text-[10px] leading-tight px-1 py-[3px] text-left truncate bg-background text-foreground">
                {p.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
