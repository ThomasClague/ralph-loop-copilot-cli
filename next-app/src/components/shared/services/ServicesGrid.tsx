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

interface ServicesGridProps {
  content: ServicesContent;
  business: BusinessInfo;
}

/**
 * Services section displayed as a responsive card grid.
 * Colors use CSS custom properties exclusively.
 */
export function ServicesGrid({ content }: ServicesGridProps) {
  const items = content.items.length > 0 ? content.items : DUMMY_ITEMS;
  const headline = content.headline ?? "Our Services";

  return (
    <section
      className="w-full py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-6xl">
        <h2
          className="mb-10 text-center text-3xl font-bold md:text-4xl"
          style={{ color: "var(--color-heading)" }}
        >
          {headline}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              {item.icon && (
                <span className="mb-3 block text-3xl" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <h3
                className="mb-2 text-xl font-semibold"
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
          ))}
        </div>
      </div>
    </section>
  );
}
