import { CheckCircle } from "lucide-react";
import { BenefitsContent, BusinessInfo } from "@/src/types/site";

interface BenefitsIconsProps {
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
];

/** Benefits section — icon card grid variant. */
export function BenefitsIcons({ content }: BenefitsIconsProps) {
  const items = content.items?.length ? content.items : PLACEHOLDER_ITEMS;

  return (
    <section className="py-16 px-4" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {content.headline && (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: "var(--color-heading)" }}
          >
            {content.headline}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 rounded-xl border"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              {/* Icon circle */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: "var(--color-primary)" }}
              >
                <CheckCircle
                  className="w-8 h-8"
                  style={{ color: "var(--color-text-inverted)" }}
                />
              </div>

              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--color-heading)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text)" }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
