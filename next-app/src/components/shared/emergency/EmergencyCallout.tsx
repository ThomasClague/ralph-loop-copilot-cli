import { Phone } from "lucide-react";
import { EmergencyContent, BusinessInfo } from "@/src/types/site";

interface EmergencyCalloutProps {
  content: EmergencyContent;
  business: BusinessInfo;
}

/** High-contrast emergency / 24-7 callout section with prominent phone CTA. */
export function EmergencyCallout({ content, business }: EmergencyCalloutProps) {
  const phone = content.phone || business.phone;
  const services = content.services ?? [];

  return (
    <section
      className="py-16 px-4"
      style={{ background: "var(--color-primary)" }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Urgency badge */}
        <span
          className="inline-block mb-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest border-2"
          style={{
            borderColor: "var(--color-text-inverted)",
            color: "var(--color-text-inverted)",
          }}
        >
          {content.availability || "24/7 Emergency Service"}
        </span>

        {/* Headline */}
        <h2
          className="text-3xl md:text-4xl font-extrabold mb-6"
          style={{ color: "var(--color-text-inverted)" }}
        >
          {content.headline}
        </h2>

        {/* Large phone number */}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-3 text-4xl md:text-6xl font-black mb-6 hover:opacity-80 transition-opacity"
            style={{ color: "var(--color-text-inverted)" }}
          >
            <Phone className="w-10 h-10 md:w-14 md:h-14" strokeWidth={2.5} />
            {phone}
          </a>
        )}

        {/* Optional services badges */}
        {services.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-2 mt-6">
            {services.map((service: string) => (
              <li
                key={service}
                className="px-4 py-2 rounded-full text-sm font-semibold border-2"
                style={{
                  borderColor: "var(--color-text-inverted)",
                  color: "var(--color-text-inverted)",
                }}
              >
                {service}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
