import { BenefitsIcons } from "@/src/components/shared/benefits/BenefitsIcons";
import { BenefitsChecklist } from "@/src/components/shared/benefits/BenefitsChecklist";
import { BenefitsContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "ProCraft Services",
  phone: "(555) 123-4567",
  email: "info@procraftservices.com",
  location: "Dallas, TX",
  industry: "home services",
};

const content: BenefitsContent = {
  headline: "Why Choose Us",
  items: [
    {
      title: "Fast & Reliable",
      description:
        "We deliver results quickly without cutting corners on quality.",
    },
    {
      title: "Fully Licensed",
      description:
        "All work is performed by certified, licensed professionals.",
    },
    {
      title: "Satisfaction Guaranteed",
      description:
        "We stand behind every job with a 100% money-back guarantee.",
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees — you always know exactly what you pay.",
    },
    {
      title: "Local Experts",
      description: "Proudly serving the community for over 10 years.",
    },
    {
      title: "24/7 Support",
      description: "Emergency assistance available around the clock.",
    },
  ],
};

export default function TestBenefitsPage() {
  return (
    <div
      style={
        {
          "--color-bg": "#ffffff",
          "--color-surface": "#f8f9fa",
          "--color-heading": "#111827",
          "--color-text": "#6b7280",
          "--color-border": "#e5e7eb",
          "--color-primary": "#2563eb",
          "--color-text-inverted": "#ffffff",
        } as React.CSSProperties
      }
    >
      <h1 style={{ padding: "2rem", fontWeight: "bold", fontSize: "1.5rem" }}>
        TASK-32: Benefits Section Variants
      </h1>
      <BenefitsIcons content={content} business={business} />
      <hr />
      <BenefitsChecklist content={content} business={business} />
    </div>
  );
}
