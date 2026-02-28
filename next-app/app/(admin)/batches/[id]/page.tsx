import Link from "next/link";
import { getBatch, listProspects } from "@/src/db/repository";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { GenerateTrigger } from "@/components/admin/GenerateTrigger";

export const dynamic = "force-dynamic";

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

      {/* Prospect table with generation trigger */}
      <GenerateTrigger batchId={id} initialProspects={prospects} />
    </div>
  );
}
