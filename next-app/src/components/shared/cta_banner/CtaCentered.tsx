import { CtaBannerContent, BusinessInfo } from "@/src/types/site";

interface CtaCenteredProps {
  content: CtaBannerContent;
  business: BusinessInfo;
}

/**
 * CtaCentered — full-width section with primary background, centered headline,
 * subheadline, CTA button, and optional phone number.
 */
export function CtaCentered({ content, business }: CtaCenteredProps) {
  return (
    <section
      className="w-full py-20"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2
          className="mb-4 text-3xl font-bold md:text-4xl"
          style={{ color: "var(--color-text-inverted)" }}
        >
          {content.headline}
        </h2>

        {content.subheadline && (
          <p
            className="mb-8 text-lg opacity-85"
            style={{ color: "var(--color-text-inverted)" }}
          >
            {content.subheadline}
          </p>
        )}

        <a
          href={content.ctaHref || "#contact"}
          className="inline-block rounded-lg px-8 py-4 text-lg font-bold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-background)",
            color: "var(--color-primary)",
          }}
        >
          {content.ctaText || "Get a Free Quote"}
        </a>

        {business.phone && (
          <p
            className="mt-6 text-sm opacity-80"
            style={{ color: "var(--color-text-inverted)" }}
          >
            Or call us:{" "}
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
