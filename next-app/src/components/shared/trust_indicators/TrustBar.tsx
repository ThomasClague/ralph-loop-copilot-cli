import { TrustIndicatorsContent, BusinessInfo } from "@/src/types/site";

interface TrustBarProps {
  content: TrustIndicatorsContent;
  business: BusinessInfo;
}

/**
 * Horizontal scrolling bar of trust indicator items with dividers between them.
 * Compact height (~100-120px), background uses --color-surface-alt.
 */
export function TrustBar({ content }: TrustBarProps) {
  const items =
    content.items.length > 0
      ? content.items
      : [
          { icon: "✅", value: "500+", label: "Customers Served" },
          { icon: "🔒", value: "Licensed", label: "& Insured" },
          { icon: "⏰", value: "24/7", label: "Service Available" },
          { icon: "⭐", value: "5-Star", label: "Rated Service" },
          { icon: "📍", value: "Local", label: "Family Owned" },
        ];

  return (
    <section
      className="w-full py-6"
      style={{ backgroundColor: "var(--color-surface-alt, var(--color-surface))" }}
    >
      <div className="mx-auto max-w-6xl overflow-x-auto px-6">
        <div className="flex min-w-max items-center justify-center gap-0">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center">
              {idx > 0 && (
                <div
                  className="mx-4 hidden h-10 w-px md:block"
                  style={{ backgroundColor: "var(--color-border)" }}
                />
              )}
              <div className="flex min-w-[100px] flex-col items-center px-4 py-2 text-center">
                {item.icon && (
                  <span className="mb-1 text-2xl">{item.icon}</span>
                )}
                <span
                  className="text-lg font-bold leading-tight"
                  style={{ color: "var(--color-heading)" }}
                >
                  {item.value}
                </span>
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--color-body)" }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
