"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const INDUSTRIES = [
  "roofing",
  "plumbing",
  "electrical",
  "landscaping",
  "cleaning",
  "painting",
  "construction",
  "hvac",
  "pest_control",
  "locksmith",
];

type Column =
  | "business_name"
  | "industry"
  | "location"
  | "phone"
  | "email"
  | "existing_url"
  | "notes";

interface ParsedRow {
  business_name: string;
  industry: string;
  location: string;
  phone: string;
  email: string;
  existing_url: string;
  notes: string;
}

/** Detect delimiter by counting occurrences in first line */
function detectDelimiter(firstLine: string): string {
  const counts = {
    ",": (firstLine.match(/,/g) || []).length,
    "\t": (firstLine.match(/\t/g) || []).length,
    "|": (firstLine.match(/\|/g) || []).length,
  };
  if (counts["\t"] > 0) return "\t";
  if (counts["|"] > 0) return "|";
  if (counts[","] > 0) return ",";
  return "";
}

/** Parse a single CSV line respecting quoted fields */
function parseCsvLine(line: string, delimiter: string): string[] {
  if (!delimiter) return [line.trim()];
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

/** Detect if the first row looks like a header row */
function isHeaderRow(row: string[]): boolean {
  const headerKeywords = ["business", "name", "industry", "location", "phone", "email", "url", "notes"];
  return row.some((cell) =>
    headerKeywords.some((kw) => cell.toLowerCase().includes(kw)),
  );
}

/** Map header column names to our field keys */
function mapHeader(col: string): Column | null {
  const normalized = col.toLowerCase().replace(/\s+/g, "_");
  const mapping: Record<string, Column> = {
    business_name: "business_name",
    business: "business_name",
    name: "business_name",
    company: "business_name",
    company_name: "business_name",
    industry: "industry",
    location: "location",
    city: "location",
    address: "location",
    phone: "phone",
    phone_number: "phone",
    telephone: "phone",
    email: "email",
    email_address: "email",
    existing_url: "existing_url",
    url: "existing_url",
    website: "existing_url",
    notes: "notes",
    note: "notes",
    comments: "notes",
  };
  return mapping[normalized] ?? null;
}

/** Parse raw input text into rows */
function parseInput(raw: string, defaultIndustry: string): ParsedRow[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const delimiter = detectDelimiter(lines[0]);
  let startIdx = 0;
  let columnMap: (Column | null)[] = [];

  const firstRow = parseCsvLine(lines[0], delimiter);

  if (isHeaderRow(firstRow)) {
    startIdx = 1;
    columnMap = firstRow.map(mapHeader);
  }

  return lines.slice(startIdx).map((line) => {
    const cells = parseCsvLine(line, delimiter);
    const row: ParsedRow = {
      business_name: "",
      industry: defaultIndustry,
      location: "",
      phone: "",
      email: "",
      existing_url: "",
      notes: "",
    };

    if (columnMap.length > 0) {
      columnMap.forEach((col, i) => {
        if (col && cells[i] !== undefined) row[col] = cells[i];
      });
    } else {
      // No header: assign positionally
      const positional: Column[] = ["business_name", "industry", "location", "phone", "email", "existing_url", "notes"];
      positional.forEach((col, i) => {
        if (cells[i] !== undefined) row[col] = cells[i];
      });
      // If single column, treat as business_name only
      if (cells.length === 1) {
        row.industry = defaultIndustry;
      }
    }

    return row;
  });
}

/** Check if two rows are duplicates (same business_name + industry) */
function isDuplicate(rows: ParsedRow[], index: number): boolean {
  const row = rows[index];
  return rows.some(
    (r, i) =>
      i !== index &&
      r.business_name.toLowerCase() === row.business_name.toLowerCase() &&
      r.industry === row.industry,
  );
}

export default function NewBatchPage() {
  const router = useRouter();
  const [batchName, setBatchName] = useState("");
  const [batchIndustry, setBatchIndustry] = useState("roofing");
  const [pasteInput, setPasteInput] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isParsed, setIsParsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleParse() {
    const rows = parseInput(pasteInput, batchIndustry);
    setParsedRows(rows);
    setIsParsed(true);
    setError(null);
  }

  function updateRow(index: number, field: Column, value: string) {
    setParsedRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeRow(index: number) {
    setParsedRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!batchName.trim()) {
      setError("Batch name is required.");
      return;
    }
    const validRows = parsedRows.filter((r) => r.business_name.trim());
    if (validRows.length === 0) {
      setError("At least one prospect with a business name is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create batch
      const batchRes = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: batchName.trim(), industry: batchIndustry }),
      });
      if (!batchRes.ok) {
        const data = await batchRes.json();
        throw new Error(data.error ?? "Failed to create batch");
      }
      const batch = await batchRes.json();

      // Create prospects
      const prospectsRes = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: batch.id,
          prospects: validRows.map((r) => ({
            businessName: r.business_name,
            industry: r.industry || batchIndustry,
            location: r.location,
            phone: r.phone,
            email: r.email,
            existingUrl: r.existing_url,
            notes: r.notes,
          })),
        }),
      });
      if (!prospectsRes.ok) {
        const data = await prospectsRes.json();
        throw new Error(data.error ?? "Failed to create prospects");
      }

      router.push(`/batches/${batch.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const validRows = parsedRows.filter((r) => r.business_name.trim());
  const dupCount = validRows.filter((_, i) => isDuplicate(parsedRows, i)).length;

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/batches">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">New Batch</h1>
      </div>

      {/* Batch meta */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="batch-name">Batch Name</Label>
          <Input
            id="batch-name"
            placeholder="e.g. London Roofers Q1"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="batch-industry">Default Industry</Label>
          <Select value={batchIndustry} onValueChange={setBatchIndustry}>
            <SelectTrigger id="batch-industry">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind} value={ind} className="capitalize">
                  {ind.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="paste">
        <TabsList>
          <TabsTrigger value="paste">Paste List</TabsTrigger>
          <TabsTrigger value="single">Single Entry</TabsTrigger>
        </TabsList>

        {/* Tab A — Paste / CSV Import */}
        <TabsContent value="paste" className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="paste-input">
              Paste CSV, TSV, or one business name per line
            </Label>
            <Textarea
              id="paste-input"
              placeholder={`business_name,industry,location,phone,email,existing_url,notes\nAcme Roofing,roofing,London,07700 900001,info@acme.co.uk,https://acme.co.uk,`}
              className="font-mono text-sm min-h-[140px]"
              value={pasteInput}
              onChange={(e) => {
                setPasteInput(e.target.value);
                setIsParsed(false);
              }}
            />
          </div>

          <Button variant="secondary" onClick={handleParse} disabled={!pasteInput.trim()}>
            Parse
          </Button>

          {/* Preview table */}
          {isParsed && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{validRows.length}</span> prospect
                  {validRows.length !== 1 ? "s" : ""} ready to import
                </p>
                {dupCount > 0 && (
                  <Badge variant="outline" className="border-amber-400 text-amber-700 gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {dupCount} duplicate{dupCount !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>

              {parsedRows.length > 0 ? (
                <div className="rounded-lg border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="w-[60px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedRows.map((row, i) => (
                        <TableRow
                          key={i}
                          className={
                            isDuplicate(parsedRows, i)
                              ? "bg-amber-50 border-amber-200"
                              : undefined
                          }
                        >
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {isDuplicate(parsedRows, i) && (
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                              )}
                              <Input
                                className="h-8 text-sm"
                                value={row.business_name}
                                onChange={(e) => updateRow(i, "business_name", e.target.value)}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.industry || batchIndustry}
                              onValueChange={(v) => updateRow(i, "industry", v)}
                            >
                              <SelectTrigger className="h-8 text-sm w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {INDUSTRIES.map((ind) => (
                                  <SelectItem key={ind} value={ind} className="capitalize text-sm">
                                    {ind.replace("_", " ")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              className="h-8 text-sm"
                              value={row.location}
                              onChange={(e) => updateRow(i, "location", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className="h-8 text-sm"
                              value={row.phone}
                              onChange={(e) => updateRow(i, "phone", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className="h-8 text-sm"
                              value={row.email}
                              onChange={(e) => updateRow(i, "email", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className="h-8 text-sm"
                              value={row.existing_url}
                              onChange={(e) => updateRow(i, "existing_url", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className="h-8 text-sm"
                              value={row.notes}
                              onChange={(e) => updateRow(i, "notes", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground"
                              onClick={() => removeRow(i)}
                            >
                              ✕
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No rows parsed.</p>
              )}
            </div>
          )}
        </TabsContent>

        {/* Tab B — Single Entry (TASK-59) */}
        <TabsContent value="single" className="pt-2">
          <p className="text-sm text-muted-foreground">
            Single entry form coming soon.
          </p>
        </TabsContent>
      </Tabs>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Submit */}
      {isParsed && validRows.length > 0 && (
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : `Create Batch (${validRows.length} prospects)`}
        </Button>
      )}
    </div>
  );
}
