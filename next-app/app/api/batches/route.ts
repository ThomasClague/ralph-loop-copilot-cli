import { NextRequest, NextResponse } from "next/server";
import { createBatch, listBatches } from "@/src/db/repository";

export async function GET() {
  try {
    const allBatches = await listBatches();
    return NextResponse.json(allBatches);
  } catch (err) {
    console.error("[GET /api/batches]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, industry } = body as { name?: string; industry?: string };

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!industry || !industry.trim()) {
      return NextResponse.json(
        { error: "industry is required" },
        { status: 400 },
      );
    }

    const batch = await createBatch({ id: crypto.randomUUID(), name: name.trim(), industry: industry.trim(), createdAt: Date.now() });
    return NextResponse.json(batch, { status: 201 });
  } catch (err) {
    console.error("[POST /api/batches]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
