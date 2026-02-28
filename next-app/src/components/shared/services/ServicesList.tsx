import { ServicesContent, BusinessInfo } from "@/src/types/site";

const DUMMY_ITEMS = [
  {
    title: "Service One",
    description: "Professional service tailored to your needs.",
    icon: "⚙️",
  },
  {
    title: "Service Two",
    description: "Reliable and efficient solutions for every project.",
    icon: "🔧",
  },
  {
    title: "Service Three",
    description: "Expert care and quality you can count on.",
    icon: "✅",
  },
];

interface ServicesListProps {
  content: ServicesContent;
  business: BusinessInfo;
}

/**
 * Services section displayed as a vertical list with icon + title + description.
 * Colors use CSS custom properties exclusively.
 */
export function ServicesList({ content }: ServicesListProps) {
  const items = content.items.length > 0 ? content.items : DUMMY_ITEMS;
  const headline = content.headline ?? "Our Services";

  return (
    <section
      className="w-full py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-3xl">
        <h2
          className="mb-10 text-3xl font-bold md:text-4xl"
          style={{ color: "var(--color-heading)" }}
        >
          {headline}
        </h2>

        <ul className="flex flex-col">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-4 py-6 transition-colors hover:opacity-90"
              style={{
                borderTop: idx === 0 ? "none" : `1px solid var(--color-border)`,
              }}
            >
              {/* Icon or number */}
              {item.icon ? (
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-primary)",
                  }}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
              ) : (
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-inverted)",
                  }}
                >
                  {idx + 1}
                </span>
              )}

              <div className="flex flex-col">
                <h3
                  className="mb-1 text-lg font-semibold"
                  style={{ color: "var(--color-heading)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-body)" }}
                >
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
