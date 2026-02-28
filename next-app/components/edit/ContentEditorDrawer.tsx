"use client";

import { useRef, useState } from "react";
import { Pencil, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { SiteSection, SectionContent } from "@/src/types/site";
import {
  SECTION_FIELDS,
  sectionToSlot,
  type ArrayField,
  type ScalarField,
} from "./sectionFields";

interface ContentEditorDrawerProps {
  sections: SiteSection[];
  onChange: (sections: SiteSection[]) => void;
  /** Batch ID — needed for image uploads */
  batchId?: string;
}

/** Human-readable label for each section type */
function sectionLabel(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Single image upload field with thumbnail and "Change Image" button. */
function ImageField({
  label,
  value,
  batchId,
  sectionType,
  onChange,
}: {
  label: string;
  value: string;
  batchId?: string;
  sectionType: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!batchId) {
      // No batch context — just create a local object URL for preview
      onChange(URL.createObjectURL(file));
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const slot = sectionToSlot(
        sectionType as Parameters<typeof sectionToSlot>[0],
      );
      const descriptor = Date.now().toString(36);
      const renamedFilename = `${slot}-general-${descriptor}.${ext}`;
      const renamed = new File([file], renamedFilename, { type: file.type });
      const formData = new FormData();
      formData.append("file", renamed);
      const res = await fetch(`/api/batches/${batchId}/media`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const record = (await res.json()) as { path: string };
        onChange(`/${record.path.replace(/\\/g, "/")}`);
      } else {
        // Fallback: use local object URL
        onChange(URL.createObjectURL(file));
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            className="h-12 w-12 rounded object-cover border shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="text-xs h-7"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-xs h-7 px-2"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-3 w-3 mr-1" />
          {uploading ? "…" : "Upload"}
        </Button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/** Renders editable fields for a single section based on SECTION_FIELDS map. */
function SectionEditor({
  section,
  batchId,
  onContentChange,
}: {
  section: SiteSection;
  batchId?: string;
  onContentChange: (content: SectionContent) => void;
}) {
  const fields = SECTION_FIELDS[section.type] ?? [];
  const content = section.content as unknown as Record<string, unknown>;

  function updateScalar(field: ScalarField, value: string) {
    onContentChange({
      ...content,
      [field.key]: value,
    } as unknown as SectionContent);
  }

  function updateArrayItem(
    field: ArrayField,
    index: number,
    subKey: string,
    value: string,
  ) {
    const arr = (content[field.key] as Record<string, unknown>[]) ?? [];
    const updated = arr.map((item, i) =>
      i === index ? { ...item, [subKey]: value } : item,
    );
    onContentChange({
      ...content,
      [field.key]: updated,
    } as unknown as SectionContent);
  }

  if (fields.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-2">
        No editable fields for this section type.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        if (field.kind === "scalar") {
          const val = (content[field.key] as string) ?? "";
          if (field.type === "image") {
            return (
              <ImageField
                key={field.key}
                label={field.label}
                value={val}
                batchId={batchId}
                sectionType={section.type}
                onChange={(v) => updateScalar(field, v)}
              />
            );
          }
          if (field.type === "textarea") {
            return (
              <div key={field.key} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {field.label}
                </p>
                <Textarea
                  value={val}
                  onChange={(e) => updateScalar(field, e.target.value)}
                  rows={3}
                  className="text-xs resize-none"
                />
              </div>
            );
          }
          return (
            <div key={field.key} className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {field.label}
              </p>
              <Input
                value={val}
                onChange={(e) => updateScalar(field, e.target.value)}
                className="text-xs h-7"
              />
            </div>
          );
        }

        // Array field
        const arr = (content[field.key] as Record<string, unknown>[]) ?? [];
        return (
          <div key={field.key} className="space-y-2">
            <p className="text-xs font-semibold">{field.label}</p>
            {arr.map((item, index) => (
              <div
                key={index}
                className="border rounded p-2 space-y-2 bg-muted/30"
              >
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  {field.itemLabel} {index + 1}
                </p>
                {field.subFields.map((sub) => {
                  const subVal = (item[sub.key] as string) ?? "";
                  if (sub.type === "image") {
                    return (
                      <ImageField
                        key={sub.key}
                        label={sub.label}
                        value={subVal}
                        batchId={batchId}
                        sectionType={section.type}
                        onChange={(v) =>
                          updateArrayItem(field, index, sub.key, v)
                        }
                      />
                    );
                  }
                  if (sub.type === "textarea") {
                    return (
                      <div key={sub.key} className="space-y-1">
                        <p className="text-[10px] text-muted-foreground">
                          {sub.label}
                        </p>
                        <Textarea
                          value={subVal}
                          onChange={(e) =>
                            updateArrayItem(
                              field,
                              index,
                              sub.key,
                              e.target.value,
                            )
                          }
                          rows={2}
                          className="text-xs resize-none"
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={sub.key} className="space-y-1">
                      <p className="text-[10px] text-muted-foreground">
                        {sub.label}
                      </p>
                      <Input
                        value={subVal}
                        onChange={(e) =>
                          updateArrayItem(field, index, sub.key, e.target.value)
                        }
                        className="text-xs h-6"
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/**
 * ContentEditorDrawer — shows a list of section edit buttons in the left panel.
 * Clicking a section opens a Sheet drawer from the right with editable fields.
 * Changes propagate to parent immediately (real-time preview update).
 */
export function ContentEditorDrawer({
  sections,
  onChange,
  batchId,
}: ContentEditorDrawerProps) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const selectedSection = sections.find((s) => s.id === openSectionId) ?? null;

  function handleContentChange(sectionId: string, content: SectionContent) {
    onChange(sections.map((s) => (s.id === sectionId ? { ...s, content } : s)));
  }

  return (
    <>
      <div className="border rounded-md p-3">
        <p className="text-xs font-semibold mb-2">Edit Content</p>
        <div className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setOpenSectionId(section.id)}
              className="w-full flex items-center gap-2 rounded px-2 py-1 text-left text-xs hover:bg-accent transition-colors"
            >
              <Pencil className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="truncate">{sectionLabel(section.type)}</span>
            </button>
          ))}
        </div>
      </div>

      <Sheet
        open={!!selectedSection}
        onOpenChange={(open) => {
          if (!open) setOpenSectionId(null);
        }}
      >
        <SheetContent
          side="right"
          className="w-[420px] sm:max-w-[420px] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-sm">
              {selectedSection ? sectionLabel(selectedSection.type) : ""}
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            {selectedSection && (
              <SectionEditor
                section={selectedSection}
                batchId={batchId}
                onContentChange={(content) =>
                  handleContentChange(selectedSection.id, content)
                }
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
