import { COMPONENT_MAP } from "@/src/lib/component-map";
import type { BusinessInfo, SiteConfig, SiteSection } from "@/src/types/site";

interface SectionRendererProps {
  section: SiteSection;
  business: BusinessInfo;
}

/** Renders a single section by looking up its component from the registry. Returns null for unknown type/variant. */
export function SectionRenderer({ section, business }: SectionRendererProps) {
  const Component = COMPONENT_MAP[section.type]?.[section.variant];
  if (!Component) return null;
  return <Component content={section.content as any} business={business} />;
}

interface SiteRendererProps {
  config: SiteConfig;
}

/** Renders all visible sections for a site in order. */
export function SiteRenderer({ config }: SiteRendererProps) {
  const visibleSections = config.sections.filter((s: SiteSection) => s.visible);
  return (
    <div>
      {visibleSections.map((section: SiteSection) => (
        <SectionRenderer
          key={section.id}
          section={section}
          business={config.businessInfo}
        />
      ))}
    </div>
  );
}
