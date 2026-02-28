"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteSection } from "@/src/types/site";

interface SectionListPanelProps {
  sections: SiteSection[];
  onChange: (sections: SiteSection[]) => void;
  /** Prospect slug — needed for the regenerate API call */
  slug?: string;
}

/** Human-readable label for each section type */
function sectionLabel(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** A single draggable section row */
function SectionRow({
  section,
  onToggle,
  onRegenerate,
  onRemove,
  isRegenerating,
}: {
  section: SiteSection;
  onToggle: () => void;
  onRegenerate: () => void;
  onRemove: () => void;
  isRegenerating: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1.5 rounded-md border bg-card px-2 py-1.5 text-xs"
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground/50 hover:text-muted-foreground"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </span>

      {/* Visibility dot */}
      <span
        className={`w-1.5 h-1.5 shrink-0 rounded-full ${section.visible ? "bg-green-500" : "bg-gray-300"}`}
      />

      {/* Label */}
      <span className="flex-1 truncate font-medium">
        {sectionLabel(section.type)}
      </span>
      <span className="text-muted-foreground/60 truncate max-w-[60px]">
        {section.variant}
      </span>

      {/* Actions */}
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={onToggle}
        title={section.visible ? "Hide section" : "Show section"}
      >
        {section.visible ? (
          <Eye className="h-3 w-3" />
        ) : (
          <EyeOff className="h-3 w-3" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={onRegenerate}
        disabled={isRegenerating}
        title="Regenerate section content"
      >
        <RefreshCw
          className={`h-3 w-3 ${isRegenerating ? "animate-spin" : ""}`}
        />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-destructive hover:text-destructive"
        onClick={onRemove}
        title="Remove section"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </li>
  );
}

/** Full section list panel with drag-and-drop, toggle, regenerate, remove. */
export function SectionListPanel({
  sections,
  onChange,
  slug,
}: SectionListPanelProps) {
  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    onChange(arrayMove(sections, oldIndex, newIndex));
  }

  function handleToggle(id: string) {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    );
  }

  async function handleRegenerate(id: string) {
    if (!slug) return;
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    setRegenerating((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/generate/prospect/${slug}/section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId: id, sectionType: section.type }),
      });
      if (res.ok) {
        const updated: SiteSection = await res.json();
        onChange(sections.map((s) => (s.id === id ? updated : s)));
      }
    } finally {
      setRegenerating((prev) => ({ ...prev, [id]: false }));
    }
  }

  function handleRemove(id: string) {
    if (!window.confirm("Remove this section from the page?")) return;
    onChange(sections.filter((s) => s.id !== id));
  }

  return (
    <div className="border rounded-md p-3">
      <p className="text-xs font-semibold mb-2">Sections ({sections.length})</p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-1">
            {sections.map((section) => (
              <SectionRow
                key={section.id}
                section={section}
                onToggle={() => handleToggle(section.id)}
                onRegenerate={() => handleRegenerate(section.id)}
                onRemove={() => handleRemove(section.id)}
                isRegenerating={!!regenerating[section.id]}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
