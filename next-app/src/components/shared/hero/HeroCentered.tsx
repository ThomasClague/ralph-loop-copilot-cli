import { HeroContent, BusinessInfo } from "@/src/types/site";

interface HeroCenteredProps {
  content: HeroContent;
  business: BusinessInfo;
}

/**
 * Full-viewport hero with centered content over a background image.
 * Colors derived exclusively from CSS custom properties.
 */
export function HeroCentered({ content, business }: HeroCenteredProps) {
  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: content.imageUrl
          ? `url(${content.imageUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-overlay, rgba(0,0,0,0.55))" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
        {content.badgeText && (
          <span
            className="mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-inverted)",
            }}
          >
            {content.badgeText}
          </span>
        )}

        <h1
          className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
          style={{ color: "var(--color-heading, #fff)" }}
        >
          {content.headline}
        </h1>

        <p
          className="mb-8 text-lg md:text-xl"
          style={{ color: "var(--color-body, rgba(255,255,255,0.85))" }}
        >
          {content.subheadline}
        </p>

        <a
          href="#contact"
          className="inline-block rounded-lg px-8 py-3 text-base font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-inverted)",
          }}
        >
          {content.ctaText}
        </a>

        {business.phone && (
          <p
            className="mt-4 text-sm"
            style={{ color: "var(--color-body, rgba(255,255,255,0.75))" }}
          >
            Call us:{" "}
            <a
              href={`tel:${business.phone}`}
              className="font-semibold underline"
              style={{ color: "var(--color-text-inverted)" }}
            >
              {business.phone}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
