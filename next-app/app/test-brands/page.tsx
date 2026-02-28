import { BrandsLogos } from "@/src/components/shared/brands";
import type { BrandsContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "ProPlumb Co.",
  phone: "555-123-4567",
  email: "info@proplumb.com",
  location: "Austin, TX",
  industry: "plumbing",
};

const content: BrandsContent = {
  headline: "Trusted Partners & Suppliers",
  brands: [
    { name: "Kohler" },
    { name: "Moen" },
    { name: "Delta" },
    { name: "American Standard" },
    { name: "Grohe" },
  ],
};

export default function TestBrandsPage() {
  return (
    <div
      style={
        {
          "--color-bg": "#f9fafb",
          "--color-surface": "#ffffff",
          "--color-heading": "#111827",
          "--color-text": "#374151",
          "--color-border": "#e5e7eb",
          "--color-primary": "#2563eb",
          "--color-text-inverted": "#ffffff",
        } as React.CSSProperties
      }
    >
      <BrandsLogos content={content} business={business} />
    </div>
  );
}
