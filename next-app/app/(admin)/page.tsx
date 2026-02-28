import Link from "next/link";
import { listBatches } from "@/src/db/repository";
import { db } from "@/src/db/index";
import { prospects } from "@/src/db/schema";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const allBatches = await listBatches();

  // Count prospects by status across all batches
  const statusCounts = await db
    .select({ status: prospects.status, count: sql<number>`count(*)` })
    .from(prospects)
    .groupBy(prospects.status);

  const totalProspects = statusCounts.reduce((sum, r) => sum + r.count, 0);
  const readyCount = statusCounts.find((r) => r.status === "ready")?.count ?? 0;
  const failedCount =
    statusCounts.find((r) => r.status === "failed")?.count ?? 0;

  // Prospect count per batch for the recent batches list
  const prospectCountsByBatch = await db
    .select({ batchId: prospects.batchId, count: sql<number>`count(*)` })
    .from(prospects)
    .groupBy(prospects.batchId);

  const countMap = Object.fromEntries(
    prospectCountsByBatch.map((r) => [r.batchId, r.count]),
  );

  // Sort by createdAt descending, take 5 most recent
  const recentBatches = [...allBatches]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)
    .map((b) => ({ ...b, prospectCount: countMap[b.id] ?? 0 }));

  return {
    totalBatches: allBatches.length,
    totalProspects,
    readyCount,
    failedCount,
    recentBatches,
  };
}

export default async function DashboardPage() {
  const {
    totalBatches,
    totalProspects,
    readyCount,
    failedCount,
    recentBatches,
  } = await getDashboardData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button asChild>
          <Link href="/batches/new">New Batch</Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalBatches}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Prospects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalProspects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">{readyCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">{failedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Batches */}
      <div>
        <h2 className="text-lg font-medium mb-3">Recent Batches</h2>
        {recentBatches.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No batches yet. Create your first batch to get started.
          </p>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Industry</th>
                  <th className="text-left px-4 py-3 font-medium">Created</th>
                  <th className="text-left px-4 py-3 font-medium">Prospects</th>
                </tr>
              </thead>
              <tbody>
                {recentBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/batches/${batch.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {batch.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">
                      {batch.industry}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {batch.prospectCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
