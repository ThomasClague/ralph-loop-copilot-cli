export interface CrawlRequest {
  url: string;
  maxPages?: number;
}

export interface PageData {
  url: string;
  title: string;
  metaDescription: string;
  headings: Record<string, string[]>;
  bodyText: string;
  links: string[];
  images: Array<{ src: string; alt: string }>;
  phones: string[];
  emails: string[];
}

export interface BrandingData {
  colors: string[];
  fonts: string[];
  logoUrl: string | null;
}

export interface CrawlResult {
  success: boolean;
  pages: PageData[];
  branding: BrandingData;
  error?: string;
}
