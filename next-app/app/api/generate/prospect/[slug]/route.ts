import { NextRequest, NextResponse } from "next/server";
import {
  getProspectBySlug,
  updateProspect,
  updateProspectStatus,
} from "@/src/db/repository";
import { runPipeline } from "@/src/lib/pipeline";

type Params = { params: Promise<{ slug: string }> };

/**
 * POST /api/generate/prospect/[slug]
 * Triggers the full AI generation pipeline for a single prospect.
 * Returns 202 immediately; the pipeline runs asynchronously in the background.
 */
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const prospect = await getProspectBySlug(slug);
    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect not found" },
        { status: 404 },
      );
    }

    await updateProspectStatus(prospect.id, "processing");

    runPipeline(prospect.id)
      .then(async (siteConfig) => {
        await updateProspect(prospect.id, {
          siteConfig: siteConfig as unknown as string,
          status: "ready",
        });
      })
      .catch(async (err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[generate/prospect/${slug}] pipeline failed:`, err);
        await updateProspect(prospect.id, {
          status: "failed",
          notes: message,
        });
      });

    return NextResponse.json(
      { message: "Generation started", slug },
      { status: 202 },
    );
  } catch (err) {
    console.error("[POST /api/generate/prospect/[slug]]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
