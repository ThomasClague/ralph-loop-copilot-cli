import { Phone, Mail, MapPin } from "lucide-react";
import { ContactContent, BusinessInfo } from "@/src/types/site";

interface ContactDetailsProps {
  content: ContactContent;
  business: BusinessInfo;
}

/**
 * ContactDetails — displays business contact info (phone, email, address,
 * business hours) without a form. Clean card-based layout.
 */
export function ContactDetails({ content, business }: ContactDetailsProps) {
  return (
    <section
      id="contact"
      className="w-full py-20"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2
          className="mb-12 text-3xl font-bold md:text-4xl"
          style={{ color: "var(--color-heading)" }}
        >
          {content.headline || "Get In Touch"}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {business.phone && (
            <div
              className="flex flex-col items-center gap-3 rounded-xl p-8"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <Phone
                className="h-8 w-8"
                style={{ color: "var(--color-primary)" }}
              />
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-heading)" }}
              >
                Phone
              </p>
              <a
                href={`tel:${business.phone}`}
                className="text-base font-medium hover:underline"
                style={{ color: "var(--color-text)" }}
              >
                {business.phone}
              </a>
            </div>
          )}

          {business.email && (
            <div
              className="flex flex-col items-center gap-3 rounded-xl p-8"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <Mail
                className="h-8 w-8"
                style={{ color: "var(--color-primary)" }}
              />
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-heading)" }}
              >
                Email
              </p>
              <a
                href={`mailto:${business.email}`}
                className="text-base font-medium hover:underline"
                style={{ color: "var(--color-text)" }}
              >
                {business.email}
              </a>
            </div>
          )}

          {(business.address || business.location) && (
            <div
              className="flex flex-col items-center gap-3 rounded-xl p-8"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <MapPin
                className="h-8 w-8"
                style={{ color: "var(--color-primary)" }}
              />
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-heading)" }}
              >
                Address
              </p>
              <p
                className="text-base font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {business.address || business.location}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
