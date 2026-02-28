import type { CondensedProfile, StructureDecision } from "./schemas";

interface ProspectInput {
  businessName: string;
  industry: string;
  location: string;
}

const SECTION_DESCRIPTIONS = `
- hero: Bold introductory banner with headline, subheadline, and call-to-action
- services: Grid or list of services the business offers
- about: Business story, team background, and mission
- trust_indicators: Stats, icons, and credentials that build credibility
- testimonials: Customer reviews and quotes
- process: Step-by-step explanation of how the business works
- service_area: Geographic coverage map or list of served locations
- gallery: Photo portfolio of completed work or products
- faq: Frequently asked questions and answers
- cta_banner: Prominent call-to-action strip to drive conversions
- contact: Contact form, phone, address, and map
- pricing: Pricing tiers or packages
- team: Team member profiles and bios
- certifications: Licences, accreditations, and awards
- emergency: 24/7 emergency contact and rapid-response messaging
- benefits: Key advantages of choosing this business
- comparison: Side-by-side comparison vs. competitors
- brands: Partner brands, suppliers, or manufacturers
- blog_preview: Recent articles or news posts
- video: Promotional or explainer video
- guarantee: Satisfaction or money-back guarantee
`.trim();

/**
 * Builds the prompt for the structure decision stage (Stage 2).
 * Asks Claude to select and order 7–10 sections for the given business.
 */
export function buildStructurePrompt(
  profile: CondensedProfile,
  prospect: ProspectInput,
): string {
  const { businessName, industry, location } = prospect;
  const summary = profile.summary || `A ${industry} business in ${location}.`;

  return `You are designing the structure of a professional website for: ${businessName}, a ${industry} business in ${location}.

Business profile: ${summary}

Select 7-10 sections from this list that would make the most compelling website for this specific business:
${SECTION_DESCRIPTIONS}

Rules:
- hero MUST be first
- contact or cta_banner MUST be last
- Minimum 7, maximum 10 sections
- Be specific to the industry and location
- Choose sections that showcase what makes this business valuable`;
}

/**
 * Builds the prompt for the content generation stage (Stage 3).
 * Asks Claude to generate specific copy for every selected section.
 */
export function buildContentPrompt(
  structure: StructureDecision,
  profile: CondensedProfile,
  prospect: ProspectInput,
): string {
  const { businessName, industry, location } = prospect;
  const services = profile.services.slice(0, 8).join(", ");
  const testimonialSnippets = profile.testimonials.slice(0, 2).join("; ");

  return `Generate compelling, specific website content for ${businessName}, a ${industry} business in ${location}.

Business profile: ${JSON.stringify(profile)}

Website sections to generate: ${structure.sections.map((s) => s.type).join(", ")}

Instructions:
- Be specific to ${location} and surrounding areas — mention real local places
- Reference actual services: ${services}
- Mention specific materials, techniques, standards for ${industry}
- Include social proof using: ${testimonialSnippets}
- Never be generic or salesy
- Always exceed the content depth of the existing site
- Tone: ${structure.tone}
- Generate content only for the sections listed above
- For each section, fill in all relevant fields with compelling, specific copy`;
}
