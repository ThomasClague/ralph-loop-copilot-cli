"use client";

import type { SiteSection } from "@/src/types/site";

interface ContentEditorDrawerProps {
  sections: SiteSection[];
  onChange: (sections: SiteSection[]) => void;
}

/** Stub for TASK-82 — placeholder content editor trigger button. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ContentEditorDrawer(_props: ContentEditorDrawerProps) {
  return (
    <div className="p-3 border rounded-md text-xs text-muted-foreground">
      <p className="font-medium text-foreground">Content Editor</p>
      <p className="mt-1">Coming in TASK-82</p>
    </div>
  );
}
