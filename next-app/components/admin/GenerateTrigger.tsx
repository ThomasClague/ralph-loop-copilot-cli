"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Mail } from "lucide-react";
import Link from "next/link";
import type { Prospect } from "@/src/db/repository";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  processing: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  scraping: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  ready: "bg-green-100 text-green-700 hover:bg-green-100",
  failed: "bg-red-100 text-red-700 hover:bg-red-100",
};

const POLL_INTERVAL_MS = 3000;

interface GenerateTriggerProps {
  batchId: string;
  initialProspects: Prospect[];
}

/**
 * Client component that renders the prospect table with live status updates
 * and a "Generate All Pending" trigger button.
 */
export function GenerateTrigger({
  batchId,
  initialProspects,
}: GenerateTriggerProps) {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [emailProspect, setEmailProspect] = useState<Prospect | null>(null);
  const [emailTemplate, setEmailTemplate] = useState("coldOutreach");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  async function handleSendEmail() {
    if (!emailProspect) return;
    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectSlug: emailProspect.slug,
          templateId: emailTemplate,
        }),
      });
      if (res.ok) {
        setNotification(`Email sent to ${emailProspect.businessName}.`);
        setEmailProspect(null);
      } else {
        const body = await res.json().catch(() => ({}));
        setNotification(`Email error: ${body.error ?? "Unknown error"}`);
      }
    } catch {
      setNotification("Network error — could not send email.");
    } finally {
      setIsSendingEmail(false);
    }
  }

  const hasPendingOrFailed = prospects.some(
    (p) => p.status === "pending" || p.status === "failed",
  );
  const isActive = prospects.some(
    (p) => p.status === "processing" || p.status === "scraping",
  );

  const total = prospects.length;
  const done = prospects.filter(
    (p) => p.status === "ready" || p.status === "failed",
  ).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  /** Fetch latest prospect statuses from the server */
  const fetchProspects = useCallback(async () => {
    try {
      const res = await fetch(`/api/batches/${batchId}/prospects`);
      if (!res.ok) return;
      const data: Prospect[] = await res.json();
      setProspects(data);
      return data;
    } catch {
      // Ignore transient network errors during polling
    }
  }, [batchId]);

  /** Start polling while generation is active */
  useEffect(() => {
    if (!isGenerating) return;

    const id = setInterval(async () => {
      const data = await fetchProspects();
      if (!data) return;

      const stillActive = data.some(
        (p) => p.status === "processing" || p.status === "scraping",
      );

      if (!stillActive) {
        clearInterval(id);
        setIsGenerating(false);
        const succeeded = data.filter((p) => p.status === "ready").length;
        const failed = data.filter((p) => p.status === "failed").length;
        setNotification(
          `Generation complete. ${succeeded} succeeded, ${failed} failed.`,
        );
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [isGenerating, fetchProspects]);

  /** Trigger generation for all pending/failed prospects */
  async function handleGenerate() {
    setIsGenerating(true);
    setNotification(null);
    setErrorMap({});

    try {
      const res = await fetch(`/api/generate/batch/${batchId}`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setNotification(`Error: ${body.error ?? "Failed to start generation"}`);
        setIsGenerating(false);
        return;
      }
      // Immediately fetch to get processing statuses
      await fetchProspects();
    } catch {
      setNotification("Network error — could not start generation.");
      setIsGenerating(false);
    }
  }

  function StatusBadge({ prospect }: { prospect: Prospect }) {
    const classes = STATUS_STYLES[prospect.status] ?? STATUS_STYLES.pending;
    const badge = (
      <Badge className={`capitalize ${classes}`}>{prospect.status}</Badge>
    );

    const errMsg = errorMap[prospect.id];
    if (prospect.status === "failed" && errMsg) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>{errMsg}</TooltipContent>
        </Tooltip>
      );
    }
    return badge;
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Generation trigger bar */}
        {(hasPendingOrFailed || isGenerating) && (
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || isActive}
              className="shrink-0"
            >
              <Zap className="mr-2 h-4 w-4" />
              {isGenerating || isActive
                ? "Generating…"
                : "Generate All Pending"}
            </Button>

            {(isGenerating || isActive) && (
              <div className="flex-1 space-y-1">
                <p className="text-sm text-muted-foreground">
                  {done} of {total} generated
                </p>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Completion / error notification */}
        {notification && (
          <div className="rounded-md border px-4 py-3 text-sm bg-background">
            {notification}
          </div>
        )}

        {/* Prospect table */}
        {prospects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No prospects in this batch yet.
          </p>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prospects.map((prospect) => (
                  <TableRow key={prospect.id}>
                    <TableCell className="font-medium">
                      {prospect.businessName}
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {prospect.industry}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {prospect.location}
                    </TableCell>
                    <TableCell>
                      <StatusBadge prospect={prospect} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {prospect.status === "ready" && (
                          <>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/preview/${prospect.slug}`}>
                                Preview
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/edit/${prospect.slug}`}>Edit</Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEmailProspect(prospect)}
                            >
                              <Mail className="mr-1 h-3 w-3" />
                              Send Email
                            </Button>
                          </>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={async () => {
                            await fetch(`/api/generate/batch/${batchId}`, {
                              method: "POST",
                            });
                            await fetchProspects();
                            setIsGenerating(true);
                          }}
                          disabled={
                            prospect.status === "processing" ||
                            prospect.status === "scraping"
                          }
                        >
                          Regenerate
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Send Email Dialog */}
      <Dialog
        open={!!emailProspect}
        onOpenChange={(open) => !open && setEmailProspect(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an outreach email to {emailProspect?.businessName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <label className="text-sm font-medium">Template</label>
            <Select value={emailTemplate} onValueChange={setEmailTemplate}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coldOutreach">Cold Outreach</SelectItem>
                <SelectItem value="followUp">Follow Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter showCloseButton>
            <Button onClick={handleSendEmail} disabled={isSendingEmail}>
              {isSendingEmail ? "Sending…" : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
