import { CheckCircle2 } from "lucide-react";
import { BenefitsContent, BusinessInfo } from "@/src/types/site";

interface BenefitsChecklistProps {
  content: BenefitsContent;
  business: BusinessInfo;
}

const PLACEHOLDER_ITEMS = [
  {
    title: "Fast & Reliable",
    description: "We deliver results quickly without cutting corners.",
  },
  {
    title: "Fully Licensed",
    description: "All work is performed by certified, licensed professionals.",
  },
  {
    title: "Satisfaction Guaranteed",
    description: "We stand behind every job with a 100% guarantee.",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden fees — you always know what you pay.",
  },
  {
    title: "Local Experts",
    description: "Serving the community for over 10 years.",
  },
  {
    title: "24/7 Support",
    description: "Emergency assistance available around the clock.",
  },
];

/** Benefits section — two-column checklist variant. */
export function BenefitsChecklist({ content }: BenefitsChecklistProps) {
  const items = content.items?.length ? content.items : PLACEHOLDER_ITEMS;

  return (
    <section className="py-16 px-4" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto">
        {content.headline && (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: "var(--color-heading)" }}
          >
            {content.headline}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <CheckCircle2
                className="w-6 h-6 flex-shrink-0 mt-0.5"
                style={{ color: "var(--color-primary)" }}
              />
              <div>
                <p
                  className="font-semibold"
                  style={{ color: "var(--color-heading)" }}
                >
                  {item.title}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-text)" }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
