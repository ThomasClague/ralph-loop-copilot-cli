import { notFound } from "next/navigation";
import { getProspectBySlug } from "@/src/db/repository";
import { loadPalette } from "@/src/lib/palettes";
import { SiteRenderer } from "@/src/components/shared/SectionRenderer";
import { PreviewTopBar } from "@/components/preview/PreviewTopBar";
import type { SiteConfig } from "@/src/types/site";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PreviewPage({ params }: Props) {
  const { slug } = await params;
  const prospect = await getProspectBySlug(slug);

  if (!prospect || prospect.status !== "ready" || !prospect.siteConfig) {
    notFound();
  }

  const siteConfig = prospect.siteConfig as unknown as SiteConfig;

  let palette;
  try {
    palette = loadPalette(siteConfig.paletteId);
  } catch {
    // Fall back to first available palette token map
    palette = {
      id: siteConfig.paletteId,
      name: siteConfig.paletteId,
      tokens: {},
    };
  }

  return (
    <>
      <PreviewTopBar
        businessName={prospect.businessName}
        slug={slug}
        batchId={prospect.batchId}
        prospectId={prospect.id}
      />
      {/* Spacer to push content below fixed top bar */}
      <div className="pt-10" style={palette.tokens as React.CSSProperties}>
        <SiteRenderer config={siteConfig} />
      </div>
    </>
  );
}
