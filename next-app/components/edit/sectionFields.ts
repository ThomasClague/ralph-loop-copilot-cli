import type { SectionType } from "@/src/types/site";

export type ScalarFieldType = "text" | "textarea" | "image" | "url";

export interface ScalarField {
  kind: "scalar";
  key: string;
  label: string;
  type: ScalarFieldType;
}

export interface ArrayItemField {
  key: string;
  label: string;
  type: ScalarFieldType;
}

export interface ArrayField {
  kind: "array";
  key: string;
  label: string;
  itemLabel: string;
  subFields: ArrayItemField[];
}

export type FieldDescriptor = ScalarField | ArrayField;

/** Maps each section type to its editable field descriptors. */
export const SECTION_FIELDS: Record<SectionType, FieldDescriptor[]> = {
  hero: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "scalar",
      key: "subheadline",
      label: "Subheadline",
      type: "textarea",
    },
    { kind: "scalar", key: "ctaText", label: "CTA Button Text", type: "text" },
    { kind: "scalar", key: "ctaHref", label: "CTA Link", type: "url" },
    {
      kind: "scalar",
      key: "imageUrl",
      label: "Background Image",
      type: "image",
    },
    { kind: "scalar", key: "badgeText", label: "Badge Text", type: "text" },
  ],
  services: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "array",
      key: "items",
      label: "Services",
      itemLabel: "Service",
      subFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
  about: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    { kind: "scalar", key: "body", label: "Body Text", type: "textarea" },
    { kind: "scalar", key: "imageUrl", label: "Image", type: "image" },
    {
      kind: "array",
      key: "stats",
      label: "Stats",
      itemLabel: "Stat",
      subFields: [
        { key: "value", label: "Value", type: "text" },
        { key: "label", label: "Label", type: "text" },
      ],
    },
  ],
  trust_indicators: [
    {
      kind: "array",
      key: "items",
      label: "Trust Indicators",
      itemLabel: "Item",
      subFields: [
        { key: "value", label: "Value", type: "text" },
        { key: "label", label: "Label", type: "text" },
      ],
    },
  ],
  testimonials: [
    {
      kind: "array",
      key: "items",
      label: "Testimonials",
      itemLabel: "Testimonial",
      subFields: [
        { key: "quote", label: "Quote", type: "textarea" },
        { key: "author", label: "Author", type: "text" },
        { key: "role", label: "Role", type: "text" },
      ],
    },
  ],
  process: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "array",
      key: "steps",
      label: "Steps",
      itemLabel: "Step",
      subFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
  service_area: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    { kind: "scalar", key: "mapEmbedUrl", label: "Map Embed URL", type: "url" },
  ],
  gallery: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "array",
      key: "images",
      label: "Images",
      itemLabel: "Image",
      subFields: [
        { key: "url", label: "Image URL", type: "image" },
        { key: "alt", label: "Alt Text", type: "text" },
        { key: "caption", label: "Caption", type: "text" },
      ],
    },
  ],
  faq: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "array",
      key: "items",
      label: "FAQ Items",
      itemLabel: "FAQ",
      subFields: [
        { key: "question", label: "Question", type: "text" },
        { key: "answer", label: "Answer", type: "textarea" },
      ],
    },
  ],
  cta_banner: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "scalar",
      key: "subheadline",
      label: "Subheadline",
      type: "textarea",
    },
    { kind: "scalar", key: "ctaText", label: "CTA Button Text", type: "text" },
    { kind: "scalar", key: "ctaHref", label: "CTA Link", type: "url" },
  ],
  contact: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
  ],
  pricing: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "array",
      key: "tiers",
      label: "Pricing Tiers",
      itemLabel: "Tier",
      subFields: [
        { key: "name", label: "Name", type: "text" },
        { key: "price", label: "Price", type: "text" },
      ],
    },
  ],
  team: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "array",
      key: "members",
      label: "Team Members",
      itemLabel: "Member",
      subFields: [
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "text" },
        { key: "bio", label: "Bio", type: "textarea" },
        { key: "imageUrl", label: "Photo", type: "image" },
      ],
    },
  ],
  certifications: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "array",
      key: "items",
      label: "Certifications",
      itemLabel: "Cert",
      subFields: [
        { key: "name", label: "Name", type: "text" },
        { key: "year", label: "Year", type: "text" },
        { key: "imageUrl", label: "Logo", type: "image" },
      ],
    },
  ],
  emergency: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    { kind: "scalar", key: "phone", label: "Phone", type: "text" },
    {
      kind: "scalar",
      key: "availability",
      label: "Availability",
      type: "text",
    },
  ],
  benefits: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "array",
      key: "items",
      label: "Benefits",
      itemLabel: "Benefit",
      subFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
  comparison: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
  ],
  brands: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "array",
      key: "brands",
      label: "Brands",
      itemLabel: "Brand",
      subFields: [
        { key: "name", label: "Name", type: "text" },
        { key: "logoUrl", label: "Logo", type: "image" },
      ],
    },
  ],
  blog_preview: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    {
      kind: "array",
      key: "posts",
      label: "Blog Posts",
      itemLabel: "Post",
      subFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "excerpt", label: "Excerpt", type: "textarea" },
        { key: "date", label: "Date", type: "text" },
        { key: "imageUrl", label: "Image", type: "image" },
      ],
    },
  ],
  video: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    { kind: "scalar", key: "videoUrl", label: "Video URL", type: "url" },
    { kind: "scalar", key: "poster", label: "Poster Image", type: "image" },
  ],
  guarantee: [
    { kind: "scalar", key: "headline", label: "Headline", type: "text" },
    { kind: "scalar", key: "body", label: "Body", type: "textarea" },
    { kind: "scalar", key: "badgeText", label: "Badge Text", type: "text" },
  ],
};

/** Maps section type to a valid upload slot (hero, gallery, about, services, team). */
export function sectionToSlot(type: SectionType): string {
  const map: Partial<Record<SectionType, string>> = {
    hero: "hero",
    gallery: "gallery",
    about: "about",
    services: "services",
    team: "team",
  };
  return map[type] ?? "hero";
}
