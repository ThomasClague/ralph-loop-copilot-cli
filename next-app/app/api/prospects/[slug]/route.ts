import { NextRequest, NextResponse } from "next/server";
import {
  getProspectBySlug,
  updateProspect,
  deleteProspect,
  type UpdateProspect,
} from "@/src/db/repository";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const prospect = await getProspectBySlug(slug);
  if (!prospect) {
    return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
  }
  return NextResponse.json(prospect);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const prospect = await getProspectBySlug(slug);
  if (!prospect) {
    return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const updates: UpdateProspect = {};

    if (body.business_name !== undefined)
      updates.businessName = body.business_name as string;
    if (body.businessName !== undefined)
      updates.businessName = body.businessName as string;
    if (body.industry !== undefined) updates.industry = body.industry as string;
    if (body.location !== undefined) updates.location = body.location as string;
    if (body.phone !== undefined) updates.phone = body.phone as string | null;
    if (body.email !== undefined) updates.email = body.email as string | null;
    if (body.notes !== undefined) updates.notes = body.notes as string | null;
    if (body.status !== undefined) updates.status = body.status as string;
    // page_data maps to siteContent; accept pre-stringified or object
    if (body.page_data !== undefined) {
      updates.siteContent =
        typeof body.page_data === "string"
          ? body.page_data
          : JSON.stringify(body.page_data);
    }
    if (body.siteContent !== undefined) {
      updates.siteContent =
        typeof body.siteContent === "string"
          ? body.siteContent
          : JSON.stringify(body.siteContent);
    }
    if (body.siteConfig !== undefined) {
      updates.siteConfig =
        typeof body.siteConfig === "string"
          ? body.siteConfig
          : JSON.stringify(body.siteConfig);
    }

    await updateProspect(prospect.id, updates);

    const updated = await getProspectBySlug(slug);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/prospects/[slug]]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const prospect = await getProspectBySlug(slug);
  if (!prospect) {
    return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
  }
  await deleteProspect(prospect.id);
  return new NextResponse(null, { status: 204 });
}
