"use client";

import type { SiteSection } from "@/src/types/site";

interface SectionListPanelProps {
  sections: SiteSection[];
  onChange: (sections: SiteSection[]) => void;
}

/** Stub for TASK-80 — renders a placeholder section list panel. */
export function SectionListPanel({ sections }: SectionListPanelProps) {
  return (
    <div className="p-3 border rounded-md text-xs text-muted-foreground">
      <p className="font-medium text-foreground mb-2">
        Sections ({sections.length})
      </p>
      <ul className="space-y-1">
        {sections.map((s) => (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${s.visible ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span className="capitalize truncate">
              {s.type.replace(/_/g, " ")}
            </span>
            <span className="text-muted-foreground/60 ml-auto">{s.variant}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
