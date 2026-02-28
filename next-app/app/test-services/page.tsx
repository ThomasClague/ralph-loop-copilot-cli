import { ServicesGrid, ServicesList } from "@/src/components/shared/services";
import type { ServicesContent, BusinessInfo } from "@/src/types/site";

const mockContent: ServicesContent = {
  headline: "Our Plumbing Services",
  items: [
    {
      title: "Drain Cleaning",
      description: "Fast and effective drain clearing for all blockages.",
      icon: "🔧",
    },
    {
      title: "Leak Repair",
      description: "Find and fix leaks before they become costly problems.",
      icon: "💧",
    },
    {
      title: "Water Heater Service",
      description:
        "Installation, repair, and maintenance of all water heaters.",
      icon: "🔥",
    },
    {
      title: "Emergency Plumbing",
      description: "24/7 emergency response for urgent plumbing issues.",
      icon: "🚨",
    },
    {
      title: "Pipe Installation",
      description: "New pipe runs and full re-plumbing for any property.",
      icon: "⚙️",
    },
    {
      title: "Bathroom Remodeling",
      description: "Complete bathroom plumbing upgrades and fixture installs.",
      icon: "🛁",
    },
  ],
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

export default function TestServicesPage() {
  return (
    <div style={cssVars}>
      <div id="services-grid">
        <h2 style={{ padding: "1rem", background: "#000", color: "#fff" }}>
          services-grid variant
        </h2>
        <ServicesGrid content={mockContent} business={mockBusiness} />
      </div>
      <div id="services-list">
        <h2 style={{ padding: "1rem", background: "#000", color: "#fff" }}>
          services-list variant
        </h2>
        <ServicesList content={mockContent} business={mockBusiness} />
      </div>
    </div>
  );
}
