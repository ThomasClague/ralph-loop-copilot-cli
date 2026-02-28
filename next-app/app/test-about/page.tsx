import { AboutLeft, AboutRight } from "@/src/components/shared/about";
import type { AboutContent, BusinessInfo } from "@/src/types/site";
import React from "react";

const mockContent: AboutContent = {
  headline: "About Smith Plumbing Co.",
  body: "With over 20 years of experience serving the Austin area, Smith Plumbing Co. is your trusted local plumbing expert. Our licensed technicians are available 24/7 for emergencies and deliver quality workmanship on every job.",
  imageUrl:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  stats: [
    { value: "20+", label: "Years Experience" },
    { value: "5,000+", label: "Jobs Completed" },
    { value: "4.9★", label: "Average Rating" },
  ],
};

const mockContentNoImage: AboutContent = {
  headline: "Why Choose Us",
  body: "We believe in honest pricing, quality work, and treating every customer like family. No hidden fees, no surprises — just reliable plumbing service you can count on.",
  stats: [{ value: "100%", label: "Satisfaction Guarantee" }],
};

const mockBusiness: BusinessInfo = {
  name: "Smith Plumbing Co.",
  phone: "(555) 123-4567",
  email: "info@smithplumbing.com",
  location: "Austin, TX",
  industry: "plumbing",
};

const cssVars = {
  "--color-primary": "#1d4ed8",
  "--color-accent": "#f59e0b",
  "--color-heading": "#1e293b",
  "--color-body": "#475569",
  "--color-text-inverted": "#ffffff",
  "--color-bg": "#f8fafc",
  "--color-surface": "#e2e8f0",
  "--color-border": "#cbd5e1",
} as React.CSSProperties;

export default function TestAboutPage() {
  return (
    <div style={cssVars}>
      <div id="about-left">
        <h2 style={{ padding: "1rem", background: "#000", color: "#fff" }}>
          about-left variant (image left, text right)
        </h2>
        <AboutLeft content={mockContent} business={mockBusiness} />
      </div>
      <div id="about-right">
        <h2 style={{ padding: "1rem", background: "#000", color: "#fff" }}>
          about-right variant (text left, image right)
        </h2>
        <AboutRight content={mockContent} business={mockBusiness} />
      </div>
      <div id="about-no-image">
        <h2 style={{ padding: "1rem", background: "#000", color: "#fff" }}>
          about-left variant (no image — placeholder)
        </h2>
        <AboutLeft content={mockContentNoImage} business={mockBusiness} />
      </div>
    </div>
  );
}
