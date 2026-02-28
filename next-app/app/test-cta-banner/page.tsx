import { CtaCentered, CtaSplit } from "@/src/components/shared/cta_banner";
import { CtaBannerContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "Acme Plumbing",
  phone: "555-1234",
  email: "info@acmeplumbing.com",
  location: "Springfield",
  industry: "plumbing",
};

const content: CtaBannerContent = {
  headline: "Ready to Get Started?",
  subheadline:
    "Contact us today for fast, professional service you can count on.",
  ctaText: "Get a Free Quote",
  ctaHref: "#contact",
};

export default function TestCtaBannerPage() {
  return (
    <main>
      <div
        style={
          {
            "--color-primary": "#2563eb",
            "--color-background": "#ffffff",
            "--color-text-inverted": "#ffffff",
          } as React.CSSProperties
        }
      >
        <div className="bg-gray-100 p-4 text-center font-bold">
          CTA Centered Variant
        </div>
        <CtaCentered content={content} business={business} />

        <div className="bg-gray-100 p-4 text-center font-bold">
          CTA Split Variant
        </div>
        <CtaSplit content={content} business={business} />
      </div>
    </main>
  );
}
