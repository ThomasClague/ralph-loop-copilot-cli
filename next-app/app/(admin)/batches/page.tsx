import Link from "next/link";
import { listBatches } from "@/src/db/repository";
import { db } from "@/src/db/index";
import { prospects } from "@/src/db/schema";
import { sql } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderOpen } from "lucide-react";

export const dynamic = "force-dynamic";

async function getBatchesData() {
  const allBatches = await listBatches();

  // Count prospects per batch
  const prospectCounts = await db
    .select({
      batchId: prospects.batchId,
      total: sql<number>`count(*)`,
      ready: sql<number>`sum(case when ${prospects.status} = 'ready' then 1 else 0 end)`,
    })
    .from(prospects)
    .groupBy(prospects.batchId);

  const countMap = Object.fromEntries(
    prospectCounts.map((r) => [r.batchId, { total: r.total, ready: r.ready }]),
  );

  return allBatches
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((b) => ({
      ...b,
      totalProspects: countMap[b.id]?.total ?? 0,
      readyCount: countMap[b.id]?.ready ?? 0,
    }));
}

export default async function BatchesPage() {
  const batches = await getBatchesData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Batches</h1>
        <Button asChild>
          <Link href="/batches/new">New Batch</Link>
        </Button>
      </div>

      {batches.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <FolderOpen className="h-16 w-16 text-muted-foreground/40" />
          <div>
            <p className="text-lg font-medium">No batches yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first batch to get started.
            </p>
          </div>
          <Button asChild>
            <Link href="/batches/new">New Batch</Link>
          </Button>
        </div>
      ) : (
        /* Batch table */
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Prospects</TableHead>
                <TableHead>Ready</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>
                    <Link
                      href={`/batches/${batch.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {batch.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {batch.industry}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(batch.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {batch.totalProspects}
                  </TableCell>
                  <TableCell>
                    {batch.readyCount > 0 ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {batch.readyCount}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/batches/${batch.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
