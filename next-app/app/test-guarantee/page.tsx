import { GuaranteeBadge } from "@/src/components/shared/guarantee";
import type { GuaranteeContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "ProPlumb Co.",
  phone: "555-123-4567",
  email: "info@proplumb.com",
  location: "Austin, TX",
  industry: "plumbing",
};

const content: GuaranteeContent = {
  headline: "Our Satisfaction Guarantee",
  body: "We stand behind every job we do. If you're not completely satisfied with our work, we'll make it right — no questions asked. That's our promise to you.",
  badgeText: "100%\nSatisfaction\nGuaranteed",
};

export default function TestGuaranteePage() {
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
      <GuaranteeBadge content={content} business={business} />
    </div>
  );
}
