export const INDUSTRY_IMAGE_QUERIES: Record<string, Record<string, string>> = {
  roofing: {
    hero: 'roofing contractor working on roof',
    gallery: 'roof tiles new installation',
    about: 'roofing team professionals',
    services: 'roof repair services',
    team: 'construction workers roofing',
  },
  plumbing: {
    hero: 'plumber pipe installation',
    gallery: 'bathroom plumbing work',
    about: 'plumber professional',
    services: 'plumbing repair service',
    team: 'plumbing technicians',
  },
  electrical: {
    hero: 'electrician wiring installation',
    gallery: 'electrical panel work',
    about: 'electrician professional',
    services: 'electrical repair service',
    team: 'electricians at work',
  },
  landscaping: {
    hero: 'landscaper garden design',
    gallery: 'beautiful lawn landscaping',
    about: 'landscaping team outdoor',
    services: 'lawn care services',
    team: 'landscaping crew workers',
  },
  cleaning: {
    hero: 'professional house cleaning service',
    gallery: 'clean modern home interior',
    about: 'cleaning professionals team',
    services: 'home cleaning supplies',
    team: 'cleaning staff workers',
  },
  painting: {
    hero: 'painter painting house exterior',
    gallery: 'freshly painted interior walls',
    about: 'painting contractor professional',
    services: 'house painting service',
    team: 'painters at work',
  },
  hvac: {
    hero: 'hvac technician air conditioning',
    gallery: 'hvac system installation',
    about: 'hvac professional technician',
    services: 'heating cooling repair',
    team: 'hvac technicians team',
  },
  construction: {
    hero: 'construction site workers building',
    gallery: 'new home construction',
    about: 'construction team professionals',
    services: 'building construction service',
    team: 'construction crew workers',
  },
  locksmith: {
    hero: 'locksmith installing door lock',
    gallery: 'door lock security hardware',
    about: 'locksmith professional',
    services: 'locksmith key service',
    team: 'locksmith technicians',
  },
  pest_control: {
    hero: 'pest control technician spraying',
    gallery: 'pest extermination service',
    about: 'pest control professional',
    services: 'pest removal treatment',
    team: 'pest control team workers',
  },
};

/**
 * Returns a Pexels search query for the given industry and image slot.
 * Falls back to construction queries, then a generic fallback string.
 */
export function getImageQuery(industry: string, slot: string): string {
  return (
    INDUSTRY_IMAGE_QUERIES[industry]?.[slot] ??
    INDUSTRY_IMAGE_QUERIES['construction']?.[slot] ??
    `${industry} professional service`
  );
}
