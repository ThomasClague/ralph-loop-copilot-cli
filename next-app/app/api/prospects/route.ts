import { NextRequest, NextResponse } from "next/server";
import { createProspects } from "@/src/db/repository";
import { slugify } from "@/src/lib/utils/slugify";
import type { NewProspect } from "@/src/db/repository";

interface ProspectInput {
  businessName: string;
  industry: string;
  location?: string;
  phone?: string;
  email?: string;
  existingUrl?: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { batchId, prospects } = body as {
      batchId?: string;
      prospects?: ProspectInput[];
    };

    if (!batchId || !batchId.trim()) {
      return NextResponse.json({ error: "batchId is required" }, { status: 400 });
    }
    if (!Array.isArray(prospects) || prospects.length === 0) {
      return NextResponse.json(
        { error: "prospects array is required and must not be empty" },
        { status: 400 },
      );
    }

    const rows: NewProspect[] = prospects.map((p) => ({
      id: crypto.randomUUID(),
      batchId,
      slug: slugify(p.businessName),
      businessName: p.businessName.trim(),
      industry: (p.industry || "").trim(),
      location: (p.location || "").trim(),
      phone: p.phone?.trim() || null,
      email: p.email?.trim() || null,
      existingUrl: p.existingUrl?.trim() || null,
      notes: p.notes?.trim() || null,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));

    const created = await createProspects(rows);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[POST /api/prospects]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
