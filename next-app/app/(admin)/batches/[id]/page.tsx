import Link from "next/link";
import { getBatch, listProspects } from "@/src/db/repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  processing: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  ready: "bg-green-100 text-green-700 hover:bg-green-100",
  failed: "bg-red-100 text-red-700 hover:bg-red-100",
};

function StatusBadge({ status }: { status: string }) {
  const classes = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return <Badge className={`capitalize ${classes}`}>{status}</Badge>;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BatchDetailPage({ params }: Props) {
  const { id } = await params;
  const batch = await getBatch(id);

  if (!batch) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-24 text-center gap-4">
        <p className="text-lg font-medium">Batch not found</p>
        <Button asChild variant="outline">
          <Link href="/batches">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batches
          </Link>
        </Button>
      </div>
    );
  }

  const prospects = await listProspects(id);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/batches">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{batch.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="capitalize">{batch.industry}</span>
            {" · "}
            Created {new Date(batch.createdAt).toLocaleDateString()}
            {" · "}
            {prospects.length} prospect{prospects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/batches/new">New Batch</Link>
        </Button>
      </div>

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
                    <StatusBadge status={prospect.status} />
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
                        </>
                      )}
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/api/prospects/${prospect.id}/generate`}>
                          Regenerate
                        </Link>
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
  );
}
