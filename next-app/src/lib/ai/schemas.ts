import { z } from "zod";

// ─── Condensation Schema (Stage 1b Part B) ────────────────────────────────────

export const condensationSchema = z.object({
  businessName: z.string().describe("The business name"),
  phones: z.array(z.string()).describe("Phone numbers found on the site"),
  emails: z.array(z.string()).describe("Email addresses found on the site"),
  address: z.string().optional().describe("Physical address of the business"),
  services: z
    .array(z.string())
    .describe("List of services offered by the business"),
  testimonials: z
    .array(z.string())
    .describe("Key testimonials or customer quotes"),
  uniquePoints: z
    .array(z.string())
    .describe("Unique selling points or differentiators"),
  yearsInBusiness: z
    .number()
    .optional()
    .describe("Number of years in business"),
  summary: z
    .string()
    .describe("A concise paragraph summarizing the business and its offerings"),
});

export type CondensedProfile = z.infer<typeof condensationSchema>;

// ─── Structure Schema (Stage 2) ──────────────────────────────────────────────

export const structureSchema = z.object({
  sections: z
    .array(
      z.object({
        type: z.enum([
          "hero",
          "services",
          "about",
          "trust_indicators",
          "testimonials",
          "process",
          "service_area",
          "gallery",
          "faq",
          "cta_banner",
          "contact",
          "pricing",
          "team",
          "certifications",
          "emergency",
          "benefits",
          "comparison",
          "brands",
          "blog_preview",
          "video",
          "guarantee",
        ]),
        variant: z
          .string()
          .describe("The specific variant to use for this section"),
        reasoning: z
          .string()
          .describe("Why this section and variant was chosen"),
      }),
    )
    .min(7)
    .max(10),
  tone: z
    .enum(["professional", "friendly", "urgent", "premium", "trustworthy"])
    .describe("The overall tone of the site"),
  paletteHint: z
    .string()
    .describe(
      'A color description like "deep blue" or "forest green" to help select a palette',
    ),
});

export type StructureDecision = z.infer<typeof structureSchema>;

// ─── Content Schemas (Stage 3) ────────────────────────────────────────────────

const heroContentSchema = z.object({
  headline: z.string().optional().describe("Main hero headline"),
  subheadline: z
    .string()
    .optional()
    .describe("Supporting text below headline"),
  ctaText: z.string().optional().describe("Call-to-action button text"),
  ctaHref: z.string().optional().describe("Call-to-action button href"),
  imageUrl: z.string().optional().describe("Hero background image URL"),
  badgeText: z.string().optional().describe("Optional badge text"),
});

const servicesContentSchema = z.object({
  headline: z.string().optional().describe("Section headline"),
  items: z
    .array(
      z.object({
        title: z.string().optional().describe("Service title"),
        description: z.string().optional().describe("Service description"),
        icon: z.string().optional().describe("Lucide icon name"),
      }),
    )
    .optional(),
});

const aboutContentSchema = z.object({
  headline: z.string().optional().describe("About section headline"),
  body: z.string().optional().describe("About section body text"),
  imageUrl: z.string().optional().describe("About image URL"),
  stats: z
    .array(
      z.object({
        value: z.string().optional().describe("Stat value (e.g. '20+')"),
        label: z.string().optional().describe("Stat label (e.g. 'Years Experience')"),
      }),
    )
    .optional(),
});

const trustIndicatorsContentSchema = z.object({
  items: z
    .array(
      z.object({
        icon: z.string().optional().describe("Lucide icon name"),
        label: z.string().optional().describe("Trust indicator label"),
        value: z.string().optional().describe("Trust indicator value"),
      }),
    )
    .optional(),
});

const testimonialsContentSchema = z.object({
  items: z
    .array(
      z.object({
        quote: z.string().optional().describe("Customer quote"),
        author: z.string().optional().describe("Customer name"),
        role: z.string().optional().describe("Customer role or description"),
        rating: z.number().optional().describe("Star rating 1-5"),
      }),
    )
    .optional(),
});

const processContentSchema = z.object({
  headline: z.string().optional().describe("Process section headline"),
  steps: z
    .array(
      z.object({
        number: z.number().optional().describe("Step number"),
        title: z.string().optional().describe("Step title"),
        description: z.string().optional().describe("Step description"),
      }),
    )
    .optional(),
});

const serviceAreaContentSchema = z.object({
  headline: z.string().optional().describe("Service area headline"),
  areas: z.array(z.string()).optional().describe("List of service areas"),
  mapEmbedUrl: z
    .string()
    .optional()
    .describe("Google Maps embed URL"),
});

const galleryContentSchema = z.object({
  headline: z.string().optional().describe("Gallery headline"),
  images: z
    .array(
      z.object({
        url: z.string().optional().describe("Image URL"),
        alt: z.string().optional().describe("Image alt text"),
        caption: z.string().optional().describe("Image caption"),
      }),
    )
    .optional(),
});

const faqContentSchema = z.object({
  headline: z.string().optional().describe("FAQ section headline"),
  items: z
    .array(
      z.object({
        question: z.string().optional().describe("FAQ question"),
        answer: z.string().optional().describe("FAQ answer"),
      }),
    )
    .optional(),
});

const ctaBannerContentSchema = z.object({
  headline: z.string().optional().describe("CTA banner headline"),
  subheadline: z.string().optional().describe("CTA banner subheadline"),
  ctaText: z.string().optional().describe("CTA button text"),
  ctaHref: z.string().optional().describe("CTA button href"),
});

const contactContentSchema = z.object({
  headline: z.string().optional().describe("Contact section headline"),
  showForm: z.boolean().optional().describe("Whether to show contact form"),
  showMap: z.boolean().optional().describe("Whether to show map"),
});

const pricingContentSchema = z.object({
  headline: z.string().optional().describe("Pricing section headline"),
  tiers: z
    .array(
      z.object({
        name: z.string().optional().describe("Tier name"),
        price: z.string().optional().describe("Tier price (e.g. '$99/mo')"),
        features: z.array(z.string()).optional().describe("List of features"),
        highlighted: z.boolean().optional().describe("Whether this is the featured tier"),
      }),
    )
    .optional(),
});

const teamContentSchema = z.object({
  headline: z.string().optional().describe("Team section headline"),
  members: z
    .array(
      z.object({
        name: z.string().optional().describe("Team member name"),
        role: z.string().optional().describe("Team member role"),
        bio: z.string().optional().describe("Team member bio"),
        imageUrl: z.string().optional().describe("Team member photo URL"),
      }),
    )
    .optional(),
});

const certificationsContentSchema = z.object({
  headline: z.string().optional().describe("Certifications section headline"),
  items: z
    .array(
      z.object({
        name: z.string().optional().describe("Certification name"),
        imageUrl: z.string().optional().describe("Certification logo URL"),
        year: z.string().optional().describe("Year earned"),
      }),
    )
    .optional(),
});

const emergencyContentSchema = z.object({
  headline: z.string().optional().describe("Emergency section headline"),
  phone: z.string().optional().describe("Emergency phone number"),
  availability: z.string().optional().describe("Availability text (e.g. '24/7')"),
  services: z.array(z.string()).optional().describe("Emergency services offered"),
});

const benefitsContentSchema = z.object({
  headline: z.string().optional().describe("Benefits section headline"),
  items: z
    .array(
      z.object({
        title: z.string().optional().describe("Benefit title"),
        description: z.string().optional().describe("Benefit description"),
        icon: z.string().optional().describe("Lucide icon name"),
      }),
    )
    .optional(),
});

const comparisonContentSchema = z.object({
  headline: z.string().optional().describe("Comparison table headline"),
  columns: z
    .array(
      z.object({
        label: z.string().optional().describe("Column header label"),
        features: z.array(z.string()).optional().describe("Features for this column"),
      }),
    )
    .optional(),
});

const brandsContentSchema = z.object({
  headline: z.string().optional().describe("Brands section headline"),
  brands: z
    .array(
      z.object({
        name: z.string().optional().describe("Brand name"),
        logoUrl: z.string().optional().describe("Brand logo URL"),
      }),
    )
    .optional(),
});

const blogPreviewContentSchema = z.object({
  headline: z.string().optional().describe("Blog preview section headline"),
  posts: z
    .array(
      z.object({
        title: z.string().optional().describe("Post title"),
        excerpt: z.string().optional().describe("Post excerpt"),
        date: z.string().optional().describe("Post date"),
        imageUrl: z.string().optional().describe("Post image URL"),
      }),
    )
    .optional(),
});

const videoContentSchema = z.object({
  headline: z.string().optional().describe("Video section headline"),
  videoUrl: z.string().optional().describe("YouTube or Vimeo URL"),
  poster: z.string().optional().describe("Poster/thumbnail image URL"),
});

const guaranteeContentSchema = z.object({
  headline: z.string().optional().describe("Guarantee section headline"),
  body: z.string().optional().describe("Guarantee body text"),
  badgeText: z.string().optional().describe("Badge text (e.g. '100% Satisfaction')"),
});

/**
 * Schema for the content generation stage output.
 * Each key is a section type; all fields optional since AI may not fill every field.
 */
export const contentSchema = z.object({
  hero: heroContentSchema.optional(),
  services: servicesContentSchema.optional(),
  about: aboutContentSchema.optional(),
  trust_indicators: trustIndicatorsContentSchema.optional(),
  testimonials: testimonialsContentSchema.optional(),
  process: processContentSchema.optional(),
  service_area: serviceAreaContentSchema.optional(),
  gallery: galleryContentSchema.optional(),
  faq: faqContentSchema.optional(),
  cta_banner: ctaBannerContentSchema.optional(),
  contact: contactContentSchema.optional(),
  pricing: pricingContentSchema.optional(),
  team: teamContentSchema.optional(),
  certifications: certificationsContentSchema.optional(),
  emergency: emergencyContentSchema.optional(),
  benefits: benefitsContentSchema.optional(),
  comparison: comparisonContentSchema.optional(),
  brands: brandsContentSchema.optional(),
  blog_preview: blogPreviewContentSchema.optional(),
  video: videoContentSchema.optional(),
  guarantee: guaranteeContentSchema.optional(),
});

export type ContentGeneration = z.infer<typeof contentSchema>;
