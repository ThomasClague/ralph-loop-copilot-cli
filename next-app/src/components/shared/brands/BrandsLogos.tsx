import { BrandsContent, BusinessInfo } from "@/src/types/site";

interface BrandsLogosProps {
  content: BrandsContent;
  business: BusinessInfo;
}

const PLACEHOLDER_BRANDS: Array<{ name: string; logoUrl?: string }> = [
  { name: "Partner One" },
  { name: "Partner Two" },
  { name: "Brand Three" },
  { name: "Supplier Four" },
  { name: "Brand Five" },
];

/**
 * BrandsLogos — displays partner or supplier brand logos in a horizontal row.
 * Shows logo images when present (grayscale with hover color), otherwise
 * falls back to a styled text badge.
 */
export function BrandsLogos({ content }: BrandsLogosProps) {
  const brands = content.brands?.length ? content.brands : PLACEHOLDER_BRANDS;

  return (
    <section
      className="w-full py-12"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {content.headline && (
          <h2
            className="mb-10 text-center text-2xl font-semibold"
            style={{ color: "var(--color-heading)" }}
          >
            {content.headline}
          </h2>
        )}

        <div className="flex flex-wrap items-center justify-center gap-8">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center"
              style={{ height: "56px", minWidth: "100px" }}
            >
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  title={brand.name}
                  className="h-full max-w-[160px] object-contain"
                  style={{
                    filter: "grayscale(100%)",
                    transition: "filter 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.filter =
                      "grayscale(0%)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.filter =
                      "grayscale(100%)")
                  }
                />
              ) : (
                <span
                  className="rounded-lg px-5 py-3 text-sm font-bold uppercase tracking-wide"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
