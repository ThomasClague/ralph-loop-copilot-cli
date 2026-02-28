import { NextRequest, NextResponse } from "next/server";
import { getBatch, deleteBatch } from "@/src/db/repository";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const batch = await getBatch(id);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }
    return NextResponse.json(batch);
  } catch (err) {
    console.error("[GET /api/batches/[id]]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const batch = await getBatch(id);
  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  }
  await deleteBatch(id);
  return new NextResponse(null, { status: 204 });
}
