import { AboutContent, BusinessInfo } from "@/src/types/site";

interface AboutLeftProps {
  content: AboutContent;
  business: BusinessInfo;
}

/**
 * About section with image on the left and text content on the right.
 * On mobile, stacks vertically (image above content).
 */
export function AboutLeft({ content, business }: AboutLeftProps) {
  const headline = content.headline || `About ${business.name}`;

  return (
    <section
      className="w-full py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Image column — left */}
        <div className="flex justify-center">
          {content.imageUrl ? (
            <img
              src={content.imageUrl}
              alt={headline}
              className="h-72 w-full max-w-md rounded-2xl object-cover shadow-md md:h-96"
            />
          ) : (
            <div
              className="flex h-72 w-full max-w-md items-center justify-center rounded-2xl md:h-96"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "2px dashed var(--color-border)",
              }}
            >
              <span
                className="text-5xl opacity-40"
                style={{ color: "var(--color-body)" }}
              >
                🏢
              </span>
            </div>
          )}
        </div>

        {/* Content column — right */}
        <div>
          <h2
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ color: "var(--color-heading)" }}
          >
            {headline}
          </h2>
          <p
            className="mb-6 text-base leading-relaxed"
            style={{ color: "var(--color-body)" }}
          >
            {content.body}
          </p>

          {content.stats && content.stats.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {content.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-inverted)",
                  }}
                >
                  {stat.value} {stat.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
