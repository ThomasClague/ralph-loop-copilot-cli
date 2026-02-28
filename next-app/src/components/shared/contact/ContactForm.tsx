import { Phone, Mail, MapPin } from "lucide-react";
import { ContactContent, BusinessInfo } from "@/src/types/site";

interface ContactFormProps {
  content: ContactContent;
  business: BusinessInfo;
}

/**
 * ContactForm — two-column layout with a contact form on the left
 * and business contact details on the right.
 */
export function ContactForm({ content, business }: ContactFormProps) {
  return (
    <section
      id="contact"
      className="w-full py-20"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          className="mb-12 text-center text-3xl font-bold md:text-4xl"
          style={{ color: "var(--color-heading)" }}
        >
          {content.headline || "Contact Us"}
        </h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact form */}
          <form className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="How can we help?"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-inverted)",
              }}
            >
              Send Message
            </button>
          </form>

          {/* Contact details */}
          <div className="flex flex-col gap-6">
            {business.phone && (
              <div className="flex items-start gap-4">
                <Phone
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "var(--color-primary)" }}
                />
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-wide"
                    style={{ color: "var(--color-heading)" }}
                  >
                    Phone
                  </p>
                  <a
                    href={`tel:${business.phone}`}
                    className="text-base hover:underline"
                    style={{ color: "var(--color-text)" }}
                  >
                    {business.phone}
                  </a>
                </div>
              </div>
            )}

            {business.email && (
              <div className="flex items-start gap-4">
                <Mail
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "var(--color-primary)" }}
                />
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-wide"
                    style={{ color: "var(--color-heading)" }}
                  >
                    Email
                  </p>
                  <a
                    href={`mailto:${business.email}`}
                    className="text-base hover:underline"
                    style={{ color: "var(--color-text)" }}
                  >
                    {business.email}
                  </a>
                </div>
              </div>
            )}

            {(business.address || business.location) && (
              <div className="flex items-start gap-4">
                <MapPin
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "var(--color-primary)" }}
                />
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-wide"
                    style={{ color: "var(--color-heading)" }}
                  >
                    Address
                  </p>
                  <p
                    className="text-base"
                    style={{ color: "var(--color-text)" }}
                  >
                    {business.address || business.location}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
