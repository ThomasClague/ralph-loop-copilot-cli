"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  prospectId: string;
}

/** Stub for TASK-84 — export button that triggers the export API. */
export function ExportButton({ prospectId }: ExportButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState<string | null>(null);

  async function handleExport() {
    setState("loading");
    setMsg(null);
    try {
      const res = await fetch(`/api/prospects/${prospectId}/export`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMsg(body.error ?? "Export failed");
        setState("error");
      } else {
        setMsg("Export triggered");
        setState("done");
      }
    } catch {
      setMsg("Export failed");
      setState("error");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={state === "loading"}
        onClick={handleExport}
        className="flex-1"
      >
        <Download className="h-3.5 w-3.5 mr-1.5" />
        {state === "loading" ? "Exporting…" : "Export Site"}
      </Button>
      {msg && (
        <span
          className={`text-xs ${state === "error" ? "text-destructive" : "text-muted-foreground"}`}
        >
          {msg}
        </span>
      )}
    </div>
  );
}
