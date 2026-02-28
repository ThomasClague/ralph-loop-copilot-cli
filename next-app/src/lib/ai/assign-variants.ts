import type { SiteSection, SectionType } from "../../types/site";

/**
 * djb2-inspired hash — deterministic, no randomness.
 * Returns a non-negative 32-bit integer.
 */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h = h & h; // 32-bit int
  }
  return Math.abs(h);
}

/**
 * Valid variant names per section type — mirrors COMPONENT_MAP.
 * Kept here to avoid a React import in pure-logic / server code.
 */
export const SECTION_VARIANTS: Record<SectionType, string[]> = {
  hero: ["centered", "split"],
  services: ["grid", "list"],
  about: ["left", "right"],
  trust_indicators: ["bar", "grid"],
  testimonials: ["cards", "carousel"],
  process: ["steps", "timeline"],
  service_area: ["list", "map"],
  gallery: ["grid", "masonry"],
  faq: ["accordion", "two-col"],
  cta_banner: ["centered", "split"],
  contact: ["form", "details"],
  pricing: ["cards"],
  team: ["cards"],
  certifications: ["logos"],
  emergency: ["callout"],
  benefits: ["icons", "checklist"],
  comparison: ["table"],
  brands: ["logos"],
  blog_preview: ["cards"],
  video: ["embed"],
  guarantee: ["badge"],
};

/**
 * Stage 5 of the AI pipeline — assigns a deterministic variant to every section.
 *
 * The same businessName + industry always produces the same assignment so that
 * regenerating copy never changes the chosen layout.
 *
 * @param sections - Sections produced by generate-content (variant may already be set)
 * @param businessName - Used as part of the hash seed
 * @param industry    - Used as part of the hash seed
 * @returns New array with `variant` set on every section
 */
export function assignVariants(
  sections: SiteSection[],
  businessName: string,
  industry: string
): SiteSection[] {
  return sections.map((section) => {
    const seed = `${businessName}-${industry}-${section.type}`;
    const h = hash(seed);
    const variants = SECTION_VARIANTS[section.type] ?? ["default"];
    const variant = variants[h % variants.length];
    return { ...section, variant };
  });
}
