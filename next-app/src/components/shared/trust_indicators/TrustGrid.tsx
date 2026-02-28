import { TrustIndicatorsContent, BusinessInfo } from "@/src/types/site";

interface TrustGridProps {
  content: TrustIndicatorsContent;
  business: BusinessInfo;
}

/**
 * Responsive 2x3 / 3x2 grid of trust indicators with large icons and labels.
 * More spacious than TrustBar; background uses --color-background.
 */
export function TrustGrid({ content }: TrustGridProps) {
  const items =
    content.items.length > 0
      ? content.items
      : [
          { icon: "✅", value: "500+", label: "Customers Served" },
          { icon: "🔒", value: "Licensed", label: "& Insured" },
          { icon: "⏰", value: "24/7", label: "Service Available" },
          { icon: "⭐", value: "5-Star", label: "Rated Service" },
          { icon: "📍", value: "Local", label: "Family Owned" },
          { icon: "🏆", value: "10+ Years", label: "Experience" },
        ];

  return (
    <section
      className="w-full py-16 px-6"
      style={{ backgroundColor: "var(--color-bg, var(--color-background))" }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center rounded-2xl p-8 text-center shadow-sm"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              {item.icon && (
                <span className="mb-3 text-5xl">{item.icon}</span>
              )}
              <span
                className="mb-1 text-2xl font-bold"
                style={{ color: "var(--color-heading)" }}
              >
                {item.value}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-body)" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
