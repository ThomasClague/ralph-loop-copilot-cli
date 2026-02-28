import type React from "react";

import { HeroCentered, HeroSplit } from "@/src/components/shared/hero";
import { ServicesGrid, ServicesList } from "@/src/components/shared/services";
import { AboutLeft, AboutRight } from "@/src/components/shared/about";
import {
  TrustBar,
  TrustGrid,
} from "@/src/components/shared/trust_indicators";
import {
  TestimonialsCards,
  TestimonialsCarousel,
} from "@/src/components/shared/testimonials";
import {
  ProcessSteps,
  ProcessTimeline,
} from "@/src/components/shared/process";
import {
  ServiceAreaList,
  ServiceAreaMap,
} from "@/src/components/shared/service_area";
import { GalleryGrid, GalleryMasonry } from "@/src/components/shared/gallery";
import { FaqAccordion, FaqTwoCol } from "@/src/components/shared/faq";
import { CtaCentered, CtaSplit } from "@/src/components/shared/cta_banner";
import { ContactForm, ContactDetails } from "@/src/components/shared/contact";
import { PricingCards } from "@/src/components/shared/pricing";
import { TeamCards } from "@/src/components/shared/team";
import { CertificationsLogos } from "@/src/components/shared/certifications";
import { EmergencyCallout } from "@/src/components/shared/emergency";
import {
  BenefitsIcons,
  BenefitsChecklist,
} from "@/src/components/shared/benefits";
import { ComparisonTable } from "@/src/components/shared/comparison";
import { BrandsLogos } from "@/src/components/shared/brands";
import { BlogPreviewCards } from "@/src/components/shared/blog_preview";
import { VideoEmbed } from "@/src/components/shared/video";
import { GuaranteeBadge } from "@/src/components/shared/guarantee";

// Single source of truth for which component renders each section type + variant.
// The AI pipeline and edit UI both use this to know valid variant options.
export const COMPONENT_MAP: Record<
  string,
  Record<string, React.ComponentType<any>>
> = {
  hero: { centered: HeroCentered, split: HeroSplit },
  services: { grid: ServicesGrid, list: ServicesList },
  about: { left: AboutLeft, right: AboutRight },
  trust_indicators: { bar: TrustBar, grid: TrustGrid },
  testimonials: { cards: TestimonialsCards, carousel: TestimonialsCarousel },
  process: { steps: ProcessSteps, timeline: ProcessTimeline },
  service_area: { list: ServiceAreaList, map: ServiceAreaMap },
  gallery: { grid: GalleryGrid, masonry: GalleryMasonry },
  faq: { accordion: FaqAccordion, "two-col": FaqTwoCol },
  cta_banner: { centered: CtaCentered, split: CtaSplit },
  contact: { form: ContactForm, details: ContactDetails },
  pricing: { cards: PricingCards },
  team: { cards: TeamCards },
  certifications: { logos: CertificationsLogos },
  emergency: { callout: EmergencyCallout },
  benefits: { icons: BenefitsIcons, checklist: BenefitsChecklist },
  comparison: { table: ComparisonTable },
  brands: { logos: BrandsLogos },
  blog_preview: { cards: BlogPreviewCards },
  video: { embed: VideoEmbed },
  guarantee: { badge: GuaranteeBadge },
};
