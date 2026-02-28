"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, ChevronDown, Loader2, ExternalLink } from "lucide-react";

interface ExportButtonProps {
  /** Prospect slug used to call POST /api/export/[slug] */
  slug: string;
  /** If set, shows a "View Published" link in the dropdown */
  exportUrl: string | null;
}

/**
 * ExportButton — shown in the edit page sidebar.
 * Provides a dropdown with "Export as ZIP" and optionally "View Published".
 */
export function ExportButton({ slug, exportUrl }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  function showToast(msg: string, type: "ok" | "err") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleExportZip() {
    setLoading(true);
    try {
      const res = await fetch(`/api/export/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "zip" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        showToast((body as { error?: string }).error ?? "Export failed", "err");
      } else {
        const data = (await res.json()) as { url?: string };
        if (data.url) {
          window.location.href = data.url;
          showToast("Download starting…", "ok");
        } else {
          showToast("Export queued", "ok");
        }
      }
    } catch {
      showToast("Export failed — network error", "err");
    } finally {
      setLoading(false);
    }
  }

  function handleViewPublished() {
    if (exportUrl) {
      window.open(exportUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            disabled={loading}
            className="w-full justify-between"
            data-testid="export-button"
          >
            <span className="flex items-center gap-1.5">
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {loading ? "Exporting…" : "Export"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={handleExportZip}
            disabled={loading}
            data-testid="export-zip-item"
          >
            <Download className="h-3.5 w-3.5 mr-2" />
            Export as ZIP
          </DropdownMenuItem>
          {exportUrl && (
            <DropdownMenuItem
              onClick={handleViewPublished}
              data-testid="view-published-item"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-2" />
              View Published
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {toast && (
        <p
          className={`text-xs px-1 ${toast.type === "err" ? "text-destructive" : "text-green-600"}`}
          data-testid="export-toast"
        >
          {toast.msg}
        </p>
      )}
    </div>
  );
}
