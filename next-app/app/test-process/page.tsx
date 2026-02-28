import { ProcessSteps } from "@/src/components/shared/process/ProcessSteps";
import { ProcessTimeline } from "@/src/components/shared/process/ProcessTimeline";
import type { ProcessContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "ProCraft Services",
  phone: "555-123-4567",
  email: "info@procraft.com",
  location: "Austin, TX",
  industry: "home services",
};

const content: ProcessContent = {
  headline: "Our Simple 4-Step Process",
  steps: [
    {
      number: 1,
      title: "Request a Quote",
      description: "Call or submit a form online. We respond within 2 hours.",
    },
    {
      number: 2,
      title: "Site Assessment",
      description: "Our expert visits and evaluates the scope of work.",
    },
    {
      number: 3,
      title: "Work Begins",
      description:
        "Certified technicians arrive on schedule to complete the job.",
    },
    {
      number: 4,
      title: "Job Complete",
      description:
        "We walk you through the finished work until you're satisfied.",
    },
  ],
};

export default function TestProcessPage() {
  return (
    <div
      style={
        {
          fontFamily: "sans-serif",
          "--color-bg": "#ffffff",
          "--color-surface": "#f9f9f9",
          "--color-border": "#dddddd",
          "--color-heading": "#111111",
          "--color-body": "#555555",
          "--color-primary": "#2563eb",
          "--color-text-inverted": "#ffffff",
        } as React.CSSProperties
      }
    >
      <h1 style={{ padding: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>
        Process Steps
      </h1>
      <ProcessSteps content={content} business={business} />

      <h1 style={{ padding: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>
        Process Timeline
      </h1>
      <ProcessTimeline content={content} business={business} />

      <h1 style={{ padding: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>
        Placeholder (empty content)
      </h1>
      <ProcessSteps content={{ headline: "", steps: [] }} business={business} />
    </div>
  );
}
