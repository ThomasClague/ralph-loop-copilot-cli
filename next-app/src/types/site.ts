// Shared types for site data model — used by admin app, AI pipeline, and exported sites

export interface BusinessInfo {
  name: string;
  phone: string;
  email: string;
  location: string;
  address?: string;
  industry: string;
}

export interface SiteConfig {
  slug: string;
  businessInfo: BusinessInfo;
  sections: SiteSection[];
  paletteId: string;
  customPalette?: Record<string, string>;
}

export type SectionType =
  | "hero"
  | "services"
  | "about"
  | "trust_indicators"
  | "testimonials"
  | "process"
  | "service_area"
  | "gallery"
  | "faq"
  | "cta_banner"
  | "contact"
  | "pricing"
  | "team"
  | "certifications"
  | "emergency"
  | "benefits"
  | "comparison"
  | "brands"
  | "blog_preview"
  | "video"
  | "guarantee";

export interface SiteSection {
  id: string;
  type: SectionType;
  variant: string;
  visible: boolean;
  content: SectionContent;
}

// ─── Section content types ────────────────────────────────────────────────────

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  badgeText?: string;
}

export interface ServicesContent {
  headline?: string;
  items: Array<{ title: string; description: string; icon?: string }>;
}

export interface AboutContent {
  headline: string;
  body: string;
  imageUrl?: string;
  stats?: Array<{ value: string; label: string }>;
}

export interface TrustIndicatorsContent {
  items: Array<{ icon?: string; label: string; value: string }>;
}

export interface TestimonialsContent {
  items: Array<{
    quote: string;
    author: string;
    role?: string;
    rating?: number;
  }>;
}

export interface ProcessContent {
  headline: string;
  steps: Array<{ number: number; title: string; description: string }>;
}

export interface ServiceAreaContent {
  headline: string;
  areas: string[];
  mapEmbedUrl?: string;
}

export interface GalleryContent {
  headline: string;
  images: Array<{ url: string; alt: string; caption?: string }>;
}

export interface FaqContent {
  headline: string;
  items: Array<{ question: string; answer: string }>;
}

export interface CtaBannerContent {
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaHref: string;
}

export interface ContactContent {
  headline: string;
  showForm: boolean;
  showMap?: boolean;
}

export interface PricingContent {
  headline: string;
  tiers: Array<{
    name: string;
    price: string;
    features: string[];
    highlighted?: boolean;
  }>;
}

export interface TeamContent {
  headline: string;
  members: Array<{
    name: string;
    role: string;
    bio?: string;
    imageUrl?: string;
  }>;
}

export interface CertificationsContent {
  headline: string;
  items: Array<{ name: string; imageUrl?: string; year?: string }>;
}

export interface EmergencyContent {
  headline: string;
  phone: string;
  availability: string;
  services?: string[];
}

export interface BenefitsContent {
  headline: string;
  items: Array<{ title: string; description: string; icon?: string }>;
}

export interface ComparisonContent {
  headline: string;
  columns: Array<{ label: string; features: string[] }>;
}

export interface BrandsContent {
  headline?: string;
  brands: Array<{ name: string; logoUrl?: string }>;
}

export interface BlogPreviewContent {
  headline: string;
  posts: Array<{
    title: string;
    excerpt: string;
    date: string;
    imageUrl?: string;
  }>;
}

export interface VideoContent {
  headline: string;
  videoUrl: string;
  poster?: string;
}

export interface GuaranteeContent {
  headline: string;
  body: string;
  badgeText?: string;
}

// ─── Union type ───────────────────────────────────────────────────────────────

export type SectionContent =
  | HeroContent
  | ServicesContent
  | AboutContent
  | TrustIndicatorsContent
  | TestimonialsContent
  | ProcessContent
  | ServiceAreaContent
  | GalleryContent
  | FaqContent
  | CtaBannerContent
  | ContactContent
  | PricingContent
  | TeamContent
  | CertificationsContent
  | EmergencyContent
  | BenefitsContent
  | ComparisonContent
  | BrandsContent
  | BlogPreviewContent
  | VideoContent
  | GuaranteeContent;
