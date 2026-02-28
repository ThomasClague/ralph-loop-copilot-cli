import { TrustBar, TrustGrid } from "@/src/components/shared/trust_indicators";

const mockContent = {
  items: [
    { icon: "✅", value: "500+", label: "Customers Served" },
    { icon: "🔒", value: "Licensed", label: "& Insured" },
    { icon: "⏰", value: "24/7", label: "Service Available" },
    { icon: "⭐", value: "5-Star", label: "Rated Service" },
    { icon: "📍", value: "Local", label: "Family Owned" },
    { icon: "🏆", value: "10+ Years", label: "Experience" },
  ],
};

const mockBusiness = {
  name: "ABC Services",
  phone: "555-1234",
  email: "info@abc.com",
  location: "New York, NY",
  industry: "plumbing",
};

export default function TestTrustPage() {
  return (
    <div>
      <h2 className="p-4 text-lg font-bold">TrustBar Variant</h2>
      <TrustBar content={mockContent} business={mockBusiness} />

      <h2 className="p-4 text-lg font-bold">TrustGrid Variant</h2>
      <TrustGrid content={mockContent} business={mockBusiness} />
    </div>
  );
}
