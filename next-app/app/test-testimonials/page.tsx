import { TestimonialsCards } from "@/src/components/shared/testimonials/TestimonialsCards";
import { TestimonialsCarousel } from "@/src/components/shared/testimonials/TestimonialsCarousel";
import type { TestimonialsContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "ProCraft Services",
  phone: "555-123-4567",
  email: "info@procraft.com",
  location: "Austin, TX",
  industry: "home services",
};

const content: TestimonialsContent = {
  items: [
    {
      quote: "Amazing work, very professional!",
      author: "Alice B.",
      role: "Homeowner",
      rating: 5,
    },
    {
      quote: "Fixed the issue quickly and for a fair price.",
      author: "Bob C.",
      role: "Business Owner",
      rating: 4,
    },
    {
      quote: "Would recommend to all my neighbors.",
      author: "Carol D.",
      rating: 5,
    },
  ],
};

export default function TestTestimonialsPage() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div
        style={
          {
            "--color-bg": "#ffffff",
            "--color-surface": "#f9f9f9",
            "--color-surface-alt": "#f0f0f0",
            "--color-border": "#dddddd",
            "--color-heading": "#111111",
            "--color-body": "#555555",
            "--color-primary": "#2563eb",
            "--color-text-inverted": "#ffffff",
          } as React.CSSProperties
        }
      >
        <h1 style={{ padding: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>
          Testimonials Cards
        </h1>
        <TestimonialsCards content={content} business={business} />

        <h1 style={{ padding: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>
          Testimonials Carousel
        </h1>
        <TestimonialsCarousel content={content} business={business} />

        <h1 style={{ padding: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>
          Placeholder (empty content)
        </h1>
        <TestimonialsCards content={{ items: [] }} business={business} />
      </div>
    </div>
  );
}
