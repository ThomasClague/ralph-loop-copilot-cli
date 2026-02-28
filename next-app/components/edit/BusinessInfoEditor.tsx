"use client";

import type { BusinessInfo } from "@/src/types/site";

interface BusinessInfoEditorProps {
  businessInfo: BusinessInfo;
  onChange: (info: BusinessInfo) => void;
}

/** Stub for TASK-83 — placeholder business info editor. */
export function BusinessInfoEditor({
  businessInfo,
}: BusinessInfoEditorProps) {
  return (
    <div className="p-3 border rounded-md text-xs text-muted-foreground">
      <p className="font-medium text-foreground mb-1">Business Info</p>
      <p className="truncate font-medium text-foreground/80">
        {businessInfo.name}
      </p>
      <p className="text-muted-foreground">{businessInfo.phone}</p>
      <p className="text-muted-foreground/60 mt-1 italic">Coming in TASK-83</p>
    </div>
  );
}
