"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Edit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewTopBarProps {
  businessName: string;
  slug: string;
  batchId: string;
  prospectId: string;
}

/** Fixed overlay top bar shown during site preview — does not affect page layout. */
export function PreviewTopBar({
  businessName,
  slug,
  batchId,
  prospectId,
}: PreviewTopBarProps) {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    setExportMsg(null);
    try {
      const res = await fetch(`/api/prospects/${prospectId}/export`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setExportMsg(body.error ?? "Export failed");
      } else {
        setExportMsg("Export triggered");
        router.refresh();
      }
    } catch {
      setExportMsg("Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-white hover:text-white hover:bg-white/10"
      >
        <Link href={`/batches/${batchId}`}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Batch
        </Link>
      </Button>

      <span className="font-semibold truncate flex-1">{businessName}</span>

      {exportMsg && (
        <span className="text-xs text-white/70 mr-1">{exportMsg}</span>
      )}

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-white hover:text-white hover:bg-white/10"
      >
        <Link href={`/edit/${slug}`}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        disabled={exporting}
        onClick={handleExport}
        className="text-white hover:text-white hover:bg-white/10"
      >
        <Download className="h-4 w-4 mr-1" />
        {exporting ? "Exporting…" : "Export"}
      </Button>
    </div>
  );
}
