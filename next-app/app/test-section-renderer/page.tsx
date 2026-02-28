import { SiteRenderer } from "@/src/components/shared/SectionRenderer";
import type { SiteConfig } from "@/src/types/site";

const testConfig: SiteConfig = {
  slug: "test",
  paletteId: "default",
  businessInfo: {
    name: "Test Plumbing Co",
    phone: "555-1234",
    email: "test@example.com",
    location: "Austin, TX",
    industry: "plumbing",
  },
  sections: [
    {
      id: "hero-1",
      type: "hero",
      variant: "centered",
      visible: true,
      content: {
        headline: "Expert Plumbing Services",
        subheadline: "Fast, reliable, affordable",
        ctaText: "Get a Quote",
        ctaHref: "#contact",
        imageUrl: "",
      },
    },
    {
      id: "services-1",
      type: "services",
      variant: "grid",
      visible: true,
      content: {
        headline: "Our Services",
        items: [],
      },
    },
    {
      id: "hidden-section",
      type: "contact",
      variant: "form",
      visible: false,
      content: {
        headline: "Contact Us",
        showForm: true,
      },
    },
  ],
};

export default function TestSectionRendererPage() {
  return (
    <div>
      <h1 style={{ padding: "1rem", background: "#f0f0f0" }}>
        SectionRenderer Integration Test
      </h1>
      <SiteRenderer config={testConfig} />
    </div>
  );
}
