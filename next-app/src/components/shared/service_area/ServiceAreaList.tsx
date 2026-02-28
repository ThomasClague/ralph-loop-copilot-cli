import { ServiceAreaContent, BusinessInfo } from "@/src/types/site";

interface ServiceAreaListProps {
  content: ServiceAreaContent;
  business: BusinessInfo;
}

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

const MAX_VISIBLE = 8;

/**
 * ServiceAreaList variant — headline + description + flex-wrap pill badges for each area.
 * Shows first 8 areas with a "+ X more" badge if there are additional areas.
 */
export function ServiceAreaList({ content, business }: ServiceAreaListProps) {
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
      <div className="mx-auto max-w-5xl px-6">
        <h2
          className="mb-4 text-center text-3xl font-bold"
          style={{ color: "var(--color-heading)" }}
        >
          {content.headline || `Areas We Serve in ${business.location}`}
        </h2>

        <p
          className="mb-10 text-center text-base leading-relaxed"
          style={{ color: "var(--color-body)" }}
        >
          {`${business.name} proudly serves customers across the following areas.`}
        </p>

        {/* Area pill badges */}
        <div className="flex flex-wrap justify-center gap-3">
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
    </section>
  );
}
