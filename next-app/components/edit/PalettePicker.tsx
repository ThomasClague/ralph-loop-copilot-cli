"use client";

import type { Palette } from "@/src/lib/palettes";

interface PalettePickerProps {
  palettes: Palette[];
  selectedId: string;
  onSelect: (paletteId: string) => void;
}

/** Stub for TASK-81 — renders a simple palette picker grid. */
export function PalettePicker({
  palettes,
  selectedId,
  onSelect,
}: PalettePickerProps) {
  return (
    <div className="p-3 border rounded-md">
      <p className="text-xs font-medium text-foreground mb-2">Palette</p>
      <div className="flex flex-wrap gap-2">
        {palettes.map((p) => (
          <button
            key={p.id}
            title={p.name}
            onClick={() => onSelect(p.id)}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              selectedId === p.id
                ? "border-primary bg-primary/10 font-semibold"
                : "border-border hover:border-primary/50"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
