import { NextRequest, NextResponse } from "next/server";
import { getProspectBySlug, updateProspect } from "@/src/db/repository";
import { generateExport } from "@/src/lib/export/exportEngine";

type Params = { params: Promise<{ slug: string }> };

/**
 * POST /api/export/[slug]
 * Triggers the export pipeline for a prospect.
 * Returns: { url: string } — download URL for the generated ZIP.
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

  try {
    const exportUrl = await generateExport(prospect);
    await updateProspect(prospect.id, {
      exportedAt: Date.now(),
      status: "exported",
    });
    return NextResponse.json({ url: exportUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
