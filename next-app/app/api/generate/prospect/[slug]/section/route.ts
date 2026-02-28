import { NextRequest, NextResponse } from "next/server";
import { getProspectBySlug } from "@/src/db/repository";
import { regenerateSection } from "@/src/lib/ai/regenerate-section";
import type { SiteConfig, SectionType } from "@/src/types/site";

type Params = { params: Promise<{ slug: string }> };

/**
 * POST /api/generate/prospect/[slug]/section
 * Regenerates content for a single section by sectionType.
 * Accepts { sectionType: string } body, returns updated section content.
 */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const prospect = await getProspectBySlug(slug);
    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect not found" },
        { status: 404 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const { sectionType } = body as { sectionType?: string };
    if (!sectionType) {
      return NextResponse.json(
        { error: "sectionType is required" },
        { status: 400 },
      );
    }

    const siteConfig = prospect.siteConfig as unknown as SiteConfig | null;
    const section = siteConfig?.sections?.find(
      (s) => s.type === (sectionType as SectionType),
    );
    if (!section) {
      return NextResponse.json(
        { error: `Section of type '${sectionType}' not found` },
        { status: 404 },
      );
    }

    const updatedSection = await regenerateSection(prospect.id, section.id);

    return NextResponse.json({ section: updatedSection }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/generate/prospect/[slug]/section]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
