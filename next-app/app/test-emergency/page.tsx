import { EmergencyCallout } from "@/src/components/shared/emergency";
import { EmergencyContent, BusinessInfo } from "@/src/types/site";

const content: EmergencyContent = {
  headline: "Emergency Service Available Now",
  phone: "0800 123 4567",
  availability: "24/7 Emergency Response",
  services: [
    "Burst Pipes",
    "Blocked Drains",
    "Boiler Breakdown",
    "Leak Detection",
  ],
};

const business: BusinessInfo = {
  name: "FastFix Plumbing",
  phone: "0800 123 4567",
  email: "help@fastfixplumbing.com",
  address: "London, UK",
  location: "London, UK",
  industry: "plumbing",
};

export default function TestEmergencyPage() {
  return (
    <div
      style={
        {
          "--color-primary": "#dc2626",
          "--color-text-inverted": "#ffffff",
        } as React.CSSProperties
      }
    >
      <EmergencyCallout content={content} business={business} />
    </div>
  );
}
