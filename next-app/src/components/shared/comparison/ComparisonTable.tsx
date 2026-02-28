import { ComparisonContent, BusinessInfo } from "@/src/types/site";

interface ComparisonTableProps {
  content: ComparisonContent;
  business: BusinessInfo;
}

const PLACEHOLDER_COLUMNS = [
  {
    label: "Us",
    features: [
      "Licensed & Insured",
      "Same-Day Service",
      "Free Estimates",
      "Satisfaction Guarantee",
      "Experienced Team",
    ],
  },
  {
    label: "Competitor A",
    features: [
      "Licensed & Insured",
      "",
      "Free Estimates",
      "",
      "Experienced Team",
    ],
  },
  {
    label: "Competitor B",
    features: ["Licensed & Insured", "", "", "", ""],
  },
];

/** Comparison section — side-by-side feature comparison table. */
export function ComparisonTable({ content, business }: ComparisonTableProps) {
  const columns = content.columns?.length
    ? content.columns
    : PLACEHOLDER_COLUMNS;
  const firstColLabel = columns[0]?.label || business.name;

  // Rows are driven by the features of the first column
  const rows = columns[0]?.features ?? [];

  return (
    <section className="py-16 px-4" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto">
        {content.headline && (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: "var(--color-heading)" }}
          >
            {content.headline}
          </h2>
        )}

        <div
          className="overflow-x-auto rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--color-surface)" }}>
                {/* Feature label column header */}
                <th
                  className="text-left py-4 px-5 font-semibold"
                  style={{
                    color: "var(--color-text)",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  Feature
                </th>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="py-4 px-5 text-center font-bold text-base"
                    style={{
                      color:
                        i === 0
                          ? "var(--color-text-inverted)"
                          : "var(--color-heading)",
                      background:
                        i === 0
                          ? "var(--color-primary)"
                          : "var(--color-surface)",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    {i === 0 ? col.label || firstColLabel : col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((featureLabel, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    background:
                      rowIndex % 2 === 0
                        ? "var(--color-bg)"
                        : "var(--color-surface)",
                  }}
                >
                  <td
                    className="py-3 px-5 font-medium"
                    style={{
                      color: "var(--color-text)",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    {featureLabel}
                  </td>
                  {columns.map((col, colIndex) => {
                    const cellValue = col.features[rowIndex];
                    const hasFeature = Boolean(cellValue);
                    return (
                      <td
                        key={colIndex}
                        className="py-3 px-5 text-center text-lg font-bold"
                        style={{
                          background:
                            colIndex === 0
                              ? "var(--color-primary-light)"
                              : undefined,
                          color: hasFeature
                            ? "var(--color-primary)"
                            : "var(--color-text)",
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        {hasFeature ? "✓" : "✗"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
