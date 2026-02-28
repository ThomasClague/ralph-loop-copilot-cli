import { ServiceAreaContent, BusinessInfo } from "@/src/types/site";
import { ServiceAreaList } from "./ServiceAreaList";

interface ServiceAreaMapProps {
  content: ServiceAreaContent;
  business: BusinessInfo;
}

const MAX_VISIBLE = 8;

const PLACEHOLDER_AREAS = [
  "Downtown",
  "Northside",
  "Eastside",
  "Westside",
  "Suburbs",
  "Midtown",
  "Riverside",
  "Uptown",
  "Lakewood",
  "Greenfield",
];

/**
 * ServiceAreaMap variant — two-column layout: map iframe on one side, area list on the other.
 * Falls back to ServiceAreaList layout if no mapEmbedUrl is provided.
 */
export function ServiceAreaMap({ content, business }: ServiceAreaMapProps) {
  if (!content.mapEmbedUrl) {
    return <ServiceAreaList content={content} business={business} />;
  }

  const areas =
    content.areas && content.areas.length > 0
      ? content.areas
      : PLACEHOLDER_AREAS;

  const visibleAreas = areas.slice(0, MAX_VISIBLE);
  const hiddenCount = areas.length - MAX_VISIBLE;

  return (
    <section
      className="w-full py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          className="mb-10 text-center text-3xl font-bold"
          style={{ color: "var(--color-heading)" }}
        >
          {content.headline || `Areas We Serve in ${business.location}`}
        </h2>

        {/* Two-column layout: map + area list */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Map iframe — 4:3 aspect ratio */}
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              border: "1px solid var(--color-border)",
              aspectRatio: "4 / 3",
            }}
          >
            <iframe
              src={content.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              sandbox="allow-scripts allow-same-origin"
              title="Service area map"
              loading="lazy"
            />
          </div>

          {/* Area list */}
          <div className="flex flex-col justify-center">
            <p
              className="mb-6 text-base leading-relaxed"
              style={{ color: "var(--color-body)" }}
            >
              {`${business.name} proudly serves customers across the following areas.`}
            </p>

            <div className="flex flex-wrap gap-3">
              {visibleAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full px-4 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: "var(--color-primary-light, #e8f0fe)",
                    color: "var(--color-primary)",
                    border: "1px solid var(--color-primary)",
                  }}
                >
                  {area}
                </span>
              ))}

              {hiddenCount > 0 && (
                <span
                  className="rounded-full px-4 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-body)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  + {hiddenCount} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
