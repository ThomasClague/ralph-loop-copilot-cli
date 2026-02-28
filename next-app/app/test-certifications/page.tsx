import { CertificationsLogos } from "@/src/components/shared/certifications";
import { CertificationsContent, BusinessInfo } from "@/src/types/site";

const mockContent: CertificationsContent = {
  headline: "Our Certifications & Accreditations",
  items: [
    { name: "BBB Accredited Business", year: "2010" },
    { name: "NATE Certified", imageUrl: "", year: "2015" },
    { name: "EPA 608 Certified", year: "2012" },
    { name: "ACCA Member", year: "2018" },
    { name: "Trane Comfort Specialist", year: "2020" },
  ],
};

const mockBusiness: BusinessInfo = {
  name: "Cool Air HVAC",
  phone: "555-1234",
  email: "info@coolair.com",
  location: "Springfield, IL",
  address: "123 Main St",
  industry: "HVAC",
};

export default function TestCertificationsPage() {
  return (
    <div
      style={
        {
          "--color-bg": "#f9fafb",
          "--color-surface": "#fff",
          "--color-heading": "#111827",
          "--color-text": "#374151",
          "--color-border": "#e5e7eb",
          "--color-primary": "#2563eb",
          "--color-text-inverted": "#fff",
        } as React.CSSProperties
      }
    >
      <CertificationsLogos content={mockContent} business={mockBusiness} />
    </div>
  );
}
