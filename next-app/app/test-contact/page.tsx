import { ContactForm, ContactDetails } from "@/src/components/shared/contact";
import { ContactContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "Acme Plumbing",
  phone: "555-1234",
  email: "info@acmeplumbing.com",
  address: "123 Main St, Springfield, IL",
  location: "Springfield, IL",
  industry: "plumbing",
};

const content: ContactContent = {
  headline: "Contact Us",
  showForm: true,
};

export default function TestContactPage() {
  return (
    <main>
      <div
        style={
          {
            "--color-bg": "#ffffff",
            "--color-surface": "#f8fafc",
            "--color-heading": "#0f172a",
            "--color-text": "#475569",
            "--color-border": "#e2e8f0",
            "--color-primary": "#2563eb",
            "--color-text-inverted": "#ffffff",
          } as React.CSSProperties
        }
      >
        <div className="bg-gray-100 p-4 text-center font-bold">
          Contact Form Variant
        </div>
        <ContactForm content={content} business={business} />

        <div className="bg-gray-100 p-4 text-center font-bold">
          Contact Details Variant
        </div>
        <ContactDetails
          content={{ ...content, headline: "Get In Touch" }}
          business={business}
        />
      </div>
    </main>
  );
}
