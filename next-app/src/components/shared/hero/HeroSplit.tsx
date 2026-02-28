import { HeroContent, BusinessInfo } from "@/src/types/site";

interface HeroSplitProps {
  content: HeroContent;
  business: BusinessInfo;
}

/**
 * Two-column hero: content left, image right.
 * Stacks vertically on mobile. Colors from CSS custom properties.
 */
export function HeroSplit({ content, business }: HeroSplitProps) {
  return (
    <section
      className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Left: content */}
      <div className="flex flex-col justify-center px-8 py-16 md:px-12 lg:px-16">
        {content.badgeText && (
          <span
            className="mb-4 inline-block self-start rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-inverted)",
            }}
          >
            {content.badgeText}
          </span>
        )}

        <h1
          className="mb-4 text-4xl font-bold leading-tight md:text-5xl"
          style={{ color: "var(--color-heading)" }}
        >
          {content.headline}
        </h1>

        <p className="mb-8 text-lg" style={{ color: "var(--color-body)" }}>
          {content.subheadline}
        </p>

        <a
          href="#contact"
          className="inline-block self-start rounded-lg px-8 py-3 text-base font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-inverted)",
          }}
        >
          {content.ctaText}
        </a>

        {business.phone && (
          <p className="mt-4 text-sm" style={{ color: "var(--color-body)" }}>
            Call us:{" "}
            <a
              href={`tel:${business.phone}`}
              className="font-semibold underline"
              style={{ color: "var(--color-primary)" }}
            >
              {business.phone}
            </a>
          </p>
        )}
      </div>

      {/* Right: image */}
      <div className="order-first md:order-last">
        {content.imageUrl ? (
          <img
            src={content.imageUrl}
            alt={content.headline}
            className="h-64 w-full object-cover md:h-full"
          />
        ) : (
          <div
            className="h-64 w-full md:h-full"
            style={{ backgroundColor: "var(--color-surface)" }}
          />
        )}
      </div>
    </section>
  );
}
