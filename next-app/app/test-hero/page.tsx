import { HeroCentered, HeroSplit } from "@/src/components/shared/hero";
import type { HeroContent, BusinessInfo } from "@/src/types/site";

const mockContent: HeroContent = {
  headline: "Professional Plumbing Services You Can Trust",
  subheadline:
    "Fast, reliable, and affordable plumbing solutions for your home and business.",
  ctaText: "Get a Free Quote",
  ctaHref: "#contact",
  imageUrl:
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200",
  badgeText: "24/7 Emergency Service",
};

const mockBusiness: BusinessInfo = {
  name: "Smith Plumbing Co.",
  phone: "(555) 123-4567",
  email: "info@smithplumbing.com",
  location: "Austin, TX",
  industry: "plumbing",
};

export default function TestHeroPage() {
  return (
    <div
      style={
        {
          "--color-primary": "#1d4ed8",
          "--color-accent": "#f59e0b",
          "--color-heading": "#ffffff",
          "--color-body": "rgba(255,255,255,0.85)",
          "--color-text-inverted": "#ffffff",
          "--color-overlay": "rgba(15,23,42,0.65)",
          "--color-bg": "#f8fafc",
          "--color-surface": "#e2e8f0",
        } as React.CSSProperties
      }
    >
      <div id="hero-centered">
        <h2 style={{ padding: "1rem", background: "#000", color: "#fff" }}>
          hero-centered variant
        </h2>
        <HeroCentered content={mockContent} business={mockBusiness} />
      </div>
      <div
        id="hero-split"
        style={
          {
            "--color-heading": "#1e293b",
            "--color-body": "#475569",
          } as React.CSSProperties
        }
      >
        <h2 style={{ padding: "1rem", background: "#000", color: "#fff" }}>
          hero-split variant
        </h2>
        <HeroSplit content={mockContent} business={mockBusiness} />
      </div>
    </div>
  );
}
