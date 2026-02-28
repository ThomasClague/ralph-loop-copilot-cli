import { NextRequest, NextResponse } from "next/server";
import { getBatch, listProspects } from "@/src/db/repository";

interface Params {
  params: Promise<{ id: string }>;
}

/** GET /api/batches/[id]/prospects — list all prospects for a batch (status polling) */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const batch = await getBatch(id);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    const prospects = await listProspects(id);
    const slim = prospects.map((p) => ({
      id: p.id,
      slug: p.slug,
      businessName: p.businessName,
      status: p.status,
      errorMessage: null,
    }));
    return NextResponse.json(slim);
  } catch (err) {
    console.error("[GET /api/batches/[id]/prospects]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
