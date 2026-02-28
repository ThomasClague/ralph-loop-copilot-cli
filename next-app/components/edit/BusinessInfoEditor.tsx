"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BusinessInfo } from "@/src/types/site";

interface BusinessInfoEditorProps {
  businessInfo: BusinessInfo;
  onChange: (info: BusinessInfo) => void;
}

/** Collapsible panel for editing core business info fields. */
export function BusinessInfoEditor({
  businessInfo,
  onChange,
}: BusinessInfoEditorProps) {
  const [open, setOpen] = useState(true);

  function handleField(field: keyof BusinessInfo, value: string) {
    onChange({ ...businessInfo, [field]: value });
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium bg-muted/40 hover:bg-muted/60 transition-colors"
      >
        <span>Business Info</span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="p-3 flex flex-col gap-3">
          <div className="grid gap-1">
            <Label htmlFor="biz-name" className="text-xs">
              Business Name
            </Label>
            <Input
              id="biz-name"
              value={businessInfo.name}
              onChange={(e) => handleField("name", e.target.value)}
              className="h-7 text-xs"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="biz-phone" className="text-xs">
              Phone
            </Label>
            <Input
              id="biz-phone"
              value={businessInfo.phone}
              onChange={(e) => handleField("phone", e.target.value)}
              className="h-7 text-xs"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="biz-email" className="text-xs">
              Email
            </Label>
            <Input
              id="biz-email"
              type="email"
              value={businessInfo.email}
              onChange={(e) => handleField("email", e.target.value)}
              className="h-7 text-xs"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="biz-location" className="text-xs">
              Location / Address
            </Label>
            <Input
              id="biz-location"
              value={businessInfo.location}
              onChange={(e) => handleField("location", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
