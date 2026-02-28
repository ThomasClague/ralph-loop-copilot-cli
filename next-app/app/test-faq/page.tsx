import { FaqAccordion, FaqTwoCol } from "@/src/components/shared/faq";
import { FaqContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "Acme Plumbing",
  phone: "555-1234",
  email: "info@acmeplumbing.com",
  location: "Springfield",
  industry: "plumbing",
};

const content: FaqContent = {
  headline: "Frequently Asked Questions",
  items: [
    {
      question: "How quickly can you respond to emergencies?",
      answer:
        "We offer 24/7 emergency service and typically arrive within 60 minutes of your call.",
    },
    {
      question: "Do you provide free estimates?",
      answer:
        "Yes! We provide free on-site estimates for all residential and commercial plumbing work.",
    },
    {
      question: "Are you licensed and insured?",
      answer:
        "Absolutely. We are fully licensed, bonded, and insured for your peace of mind.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash, check, and all major credit cards. Financing options are also available.",
    },
    {
      question: "Do you service commercial properties?",
      answer:
        "Yes, we handle both residential and commercial plumbing projects of all sizes.",
    },
    {
      question: "What areas do you serve?",
      answer:
        "We serve Springfield and all surrounding communities within a 30-mile radius.",
    },
  ],
};

export default function TestFaqPage() {
  return (
    <main>
      <div
        style={
          {
            "--color-bg": "#ffffff",
            "--color-surface": "#f9fafb",
            "--color-heading": "#111827",
            "--color-text": "#374151",
            "--color-primary": "#2563eb",
            "--color-border": "#e5e7eb",
          } as React.CSSProperties
        }
      >
        <div className="bg-gray-100 p-4 text-center font-bold">
          FAQ Accordion Variant
        </div>
        <FaqAccordion content={content} business={business} />

        <div className="bg-gray-100 p-4 text-center font-bold">
          FAQ Two Column Variant
        </div>
        <FaqTwoCol content={content} business={business} />
      </div>
    </main>
  );
}
