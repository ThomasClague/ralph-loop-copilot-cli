import { NextRequest, NextResponse } from "next/server";
import { listProspects, updateProspectStatus } from "@/src/db/repository";
import { runPipeline } from "@/src/lib/pipeline";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/generate/batch/[id]
 * Triggers the AI generation pipeline for all pending/failed prospects in a batch.
 * Returns 202 immediately; pipelines run in the background.
 */
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { id: batchId } = await params;
    const prospects = await listProspects(batchId);
    const eligible = prospects.filter(
      (p) => p.status === "pending" || p.status === "failed",
    );

    if (eligible.length === 0) {
      return NextResponse.json(
        { message: "No pending or failed prospects to generate", count: 0 },
        { status: 200 },
      );
    }

    // Mark all eligible prospects as processing immediately
    await Promise.all(
      eligible.map((p) => updateProspectStatus(p.id, "processing")),
    );

    // Fire and forget — run pipelines in the background
    (async () => {
      for (const prospect of eligible) {
        try {
          await runPipeline(prospect.id);
        } catch (err) {
          console.error(`[generate] prospect ${prospect.id} failed:`, err);
          await updateProspectStatus(prospect.id, "failed");
        }
      }
    })().catch(console.error);

    return NextResponse.json(
      { message: "Generation started", count: eligible.length },
      { status: 202 },
    );
  } catch (err) {
    console.error("[POST /api/generate/batch/[id]]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
