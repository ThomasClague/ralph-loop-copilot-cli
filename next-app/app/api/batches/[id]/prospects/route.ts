import { NextRequest, NextResponse } from "next/server";
import { listProspects } from "@/src/db/repository";

interface Params {
  params: Promise<{ id: string }>;
}

/** GET /api/batches/[id]/prospects — list all prospects for a batch */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const prospects = await listProspects(id);
    return NextResponse.json(prospects);
  } catch (err) {
    console.error("[GET /api/batches/[id]/prospects]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
