import { PricingCards } from "@/src/components/shared/pricing";
import { PricingContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "AcmePro Services",
  phone: "555-123-4567",
  email: "info@acmepro.com",
  location: "Springfield, IL",
  address: "123 Main St",
  industry: "home services",
};

const content: PricingContent = {
  headline: "Simple, Transparent Pricing",
  tiers: [
    {
      name: "Basic",
      price: "$99",
      features: ["One-time visit", "30-day guarantee", "Phone support"],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$199",
      features: [
        "Everything in Basic",
        "Priority scheduling",
        "90-day guarantee",
        "Free follow-up",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$349",
      features: [
        "Everything in Pro",
        "Annual plan",
        "1-year guarantee",
        "24/7 support",
        "Free parts",
      ],
      highlighted: false,
    },
  ],
};

export default function TestPricingPage() {
  return (
    <div
      style={
        {
          "--color-bg": "#f8fafc",
          "--color-surface": "#ffffff",
          "--color-heading": "#1e293b",
          "--color-text": "#475569",
          "--color-border": "#e2e8f0",
          "--color-primary": "#2563eb",
          "--color-text-inverted": "#ffffff",
        } as React.CSSProperties
      }
    >
      <PricingCards content={content} business={business} />
    </div>
  );
}
