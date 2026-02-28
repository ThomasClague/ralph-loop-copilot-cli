import { NextRequest, NextResponse } from "next/server";
import { getProspectBySlug } from "@/src/db/repository";

type Params = { params: Promise<{ slug: string }> };

/**
 * POST /api/export/[slug]
 * Triggers the export pipeline for a prospect.
 * Body: { format: 'zip' }
 * Returns: { url: string } — download URL for the generated ZIP.
 * NOTE: Full export engine implemented in TASK-86. This stub returns 501 until then.
 */
export async function POST(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const prospect = await getProspectBySlug(slug);
  if (!prospect) {
    return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
  }
  if (!prospect.siteConfig) {
    return NextResponse.json(
      { error: "No generated site — run generation first" },
      { status: 400 },
    );
  }

  // Export engine will be implemented in TASK-86.
  return NextResponse.json(
    { error: "Export engine not yet implemented" },
    { status: 501 },
  );
}
