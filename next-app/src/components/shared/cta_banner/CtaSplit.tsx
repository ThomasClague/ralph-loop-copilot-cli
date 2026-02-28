import { CtaBannerContent, BusinessInfo } from "@/src/types/site";

interface CtaSplitProps {
  content: CtaBannerContent;
  business: BusinessInfo;
}

/**
 * CtaSplit — two-column layout: left side has headline + subheadline on primary
 * background; right side has CTA button + phone number. Stacks on mobile.
 */
export function CtaSplit({ content, business }: CtaSplitProps) {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-stretch md:flex-row">
        {/* Left: text */}
        <div className="flex flex-1 flex-col justify-center px-8 py-16">
          <h2
            className="mb-3 text-2xl font-bold md:text-3xl"
            style={{ color: "var(--color-text-inverted)" }}
          >
            {content.headline}
          </h2>
          {content.subheadline && (
            <p
              className="text-base opacity-85 md:text-lg"
              style={{ color: "var(--color-text-inverted)" }}
            >
              {content.subheadline}
            </p>
          )}
        </div>

        {/* Right: CTA */}
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 md:min-w-64">
          <a
            href={content.ctaHref || "#contact"}
            className="inline-block w-full rounded-lg px-8 py-4 text-center text-lg font-bold transition-opacity hover:opacity-90 md:w-auto"
            style={{
              backgroundColor: "var(--color-background)",
              color: "var(--color-primary)",
            }}
          >
            {content.ctaText || "Get a Free Quote"}
          </a>

          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="text-sm font-semibold opacity-80 hover:opacity-100"
              style={{ color: "var(--color-text-inverted)" }}
            >
              {business.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
