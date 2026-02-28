import { TeamCards } from "@/src/components/shared/team";

const sampleContent = {
  headline: "Meet Our Team",
  members: [
    {
      name: "Alice Johnson",
      role: "Lead Technician",
      bio: "Alice has over 10 years of experience in HVAC systems and is certified in multiple specialties.",
    },
    {
      name: "Bob Smith",
      role: "Service Manager",
      bio: "Bob oversees all service operations and ensures every job is completed to the highest standard.",
    },
    {
      name: "Carol Davis",
      role: "Customer Success",
      imageUrl: "https://i.pravatar.cc/150?img=47",
    },
    {
      name: "Dan Lee",
      role: "Field Technician",
    },
  ],
};

const sampleBusiness = {
  name: "Acme Services",
  phone: "555-123-4567",
  email: "info@acme.com",
  address: "123 Main St",
  city: "Springfield",
  state: "IL",
  location: "Springfield, IL",
  industry: "HVAC",
};

export default function TestTeamPage() {
  return (
    <div
      style={
        {
          "--color-bg": "#f8f9fa",
          "--color-surface": "#ffffff",
          "--color-heading": "#111827",
          "--color-text": "#6b7280",
          "--color-primary": "#2563eb",
          "--color-border": "#e5e7eb",
          "--color-text-inverted": "#ffffff",
        } as React.CSSProperties
      }
    >
      <TeamCards content={sampleContent} business={sampleBusiness} />
    </div>
  );
}
