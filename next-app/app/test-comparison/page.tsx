import { ComparisonTable } from "@/src/components/shared/comparison";
import type { ComparisonContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "ProPlumb Co.",
  phone: "555-123-4567",
  email: "info@proplumb.com",
  location: "Austin, TX",
  industry: "plumbing",
};

const content: ComparisonContent = {
  headline: "Why Choose Us vs The Competition?",
  columns: [
    {
      label: "ProPlumb Co.",
      features: [
        "Licensed & Insured",
        "Same-Day Service",
        "Free Estimates",
        "Satisfaction Guarantee",
        "Experienced Team",
      ],
    },
    {
      label: "Competitor A",
      features: [
        "Licensed & Insured",
        "",
        "Free Estimates",
        "",
        "Experienced Team",
      ],
    },
    {
      label: "Competitor B",
      features: ["Licensed & Insured", "", "", "", ""],
    },
  ],
};

export default function TestComparisonPage() {
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
          "--color-primary-light": "#dbeafe",
          "--color-text-inverted": "#ffffff",
        } as React.CSSProperties
      }
    >
      <ComparisonTable content={content} business={business} />
    </div>
  );
}
