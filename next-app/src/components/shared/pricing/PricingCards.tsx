import { PricingContent, BusinessInfo } from "@/src/types/site";

interface PricingCardsProps {
  content: PricingContent;
  business: BusinessInfo;
}

const PLACEHOLDER_TIERS = [
  {
    name: "Basic",
    price: "$99",
    features: ["Service visit", "Basic inspection", "30-day guarantee"],
    highlighted: false,
  },
  {
    name: "Standard",
    price: "$199",
    features: [
      "Everything in Basic",
      "Priority scheduling",
      "90-day guarantee",
      "Free follow-up",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$349",
    features: [
      "Everything in Standard",
      "Annual maintenance plan",
      "1-year guarantee",
      "24/7 support",
      "Free parts",
    ],
    highlighted: false,
  },
];

/**
 * PricingCards — three-column pricing tier cards with highlighted "Most Popular" tier.
 * Highlighted card has a primary-color border, scale-up, and "Most Popular" badge.
 */
export function PricingCards({ content, business }: PricingCardsProps) {
  const tiers =
    content.tiers && content.tiers.length > 0
      ? content.tiers
      : PLACEHOLDER_TIERS;

  return (
    <section
      className="w-full py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          className="mb-12 text-center text-3xl font-bold"
          style={{ color: "var(--color-heading)" }}
        >
          {content.headline || "Our Pricing Plans"}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col rounded-2xl p-8 transition-transform ${
                tier.highlighted ? "scale-105" : ""
              }`}
              style={{
                backgroundColor: "var(--color-surface)",
                border: tier.highlighted
                  ? "2px solid var(--color-primary)"
                  : "1px solid var(--color-border)",
                boxShadow: tier.highlighted
                  ? "0 8px 32px rgba(0,0,0,0.12)"
                  : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {tier.highlighted && (
                <span
                  className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-inverted)",
                  }}
                >
                  Most Popular
                </span>
              )}

              <h3
                className="mb-2 text-xl font-bold"
                style={{ color: "var(--color-heading)" }}
              >
                {tier.name}
              </h3>

              <p
                className="mb-6 text-4xl font-extrabold"
                style={{ color: "var(--color-primary)" }}
              >
                {tier.price}
              </p>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature, fIdx) => (
                  <li
                    key={fIdx}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "var(--color-text)" }}
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
                      style={{ color: "var(--color-primary)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-auto block rounded-lg px-6 py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90"
                style={
                  tier.highlighted
                    ? {
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-text-inverted)",
                      }
                    : {
                        border: "2px solid var(--color-primary)",
                        color: "var(--color-primary)",
                        backgroundColor: "transparent",
                      }
                }
              >
                {business.name ? `Get Started` : "Get Started"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
