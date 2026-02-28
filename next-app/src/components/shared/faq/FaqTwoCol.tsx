import { FaqContent, BusinessInfo } from "@/src/types/site";

interface FaqTwoColProps {
  content: FaqContent;
  business: BusinessInfo;
}

const PLACEHOLDER_ITEMS = [
  {
    question: "What services do you offer?",
    answer:
      "We offer a comprehensive range of professional services tailored to meet your needs.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Getting a quote is easy! Simply reach out to us by phone or through our contact form.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes, we are fully licensed and insured. Your satisfaction and safety are our top priorities.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve the local area and surrounding communities. Contact us to confirm availability.",
  },
  {
    question: "How long does the process take?",
    answer:
      "Timelines vary by project. We'll provide a clear estimate during your consultation.",
  },
  {
    question: "Do you offer warranties?",
    answer:
      "Yes, we stand behind our work with a satisfaction guarantee on all services performed.",
  },
];

/**
 * FaqTwoCol — static two-column FAQ layout.
 * First half of items in column 1, second half in column 2.
 */
export function FaqTwoCol({ content, business }: FaqTwoColProps) {
  const items =
    content.items && content.items.length > 0
      ? content.items
      : PLACEHOLDER_ITEMS;

  const mid = Math.ceil(items.length / 2);
  const col1 = items.slice(0, mid);
  const col2 = items.slice(mid);

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
          {content.headline || `Frequently Asked Questions`}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Column 1 */}
          <div className="space-y-8">
            {col1.map((item, idx) => (
              <div key={idx}>
                <h3
                  className="mb-2 text-lg font-bold"
                  style={{ color: "var(--color-heading)" }}
                >
                  {item.question}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--color-text)" }}
                >
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-8">
            {col2.map((item, idx) => (
              <div key={idx}>
                <h3
                  className="mb-2 text-lg font-bold"
                  style={{ color: "var(--color-heading)" }}
                >
                  {item.question}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--color-text)" }}
                >
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {business.phone && (
          <p
            className="mt-10 text-center text-sm"
            style={{ color: "var(--color-text)" }}
          >
            Still have questions? Call us at{" "}
            <a
              href={`tel:${business.phone}`}
              className="font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {business.phone}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
