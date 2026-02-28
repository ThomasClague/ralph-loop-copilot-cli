import { TestimonialsContent, BusinessInfo } from "@/src/types/site";

interface TestimonialsCardsProps {
  content: TestimonialsContent;
  business: BusinessInfo;
}

/** Renders 1–5 filled stars based on rating value. */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            color: i < rating ? "var(--color-primary)" : "var(--color-border)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const PLACEHOLDER_TESTIMONIALS = [
  {
    quote:
      "Absolutely fantastic service. They showed up on time, did the job right, and left everything spotless.",
    author: "Sarah M.",
    role: "Homeowner",
    rating: 5,
  },
  {
    quote:
      "I've used them twice now and both times they exceeded my expectations. Highly recommend!",
    author: "James K.",
    role: "Business Owner",
    rating: 5,
  },
  {
    quote:
      "Professional, friendly, and reasonably priced. Will definitely call them again.",
    author: "Linda T.",
    role: "Local Resident",
    rating: 4,
  },
];

/**
 * Testimonials grid variant — displays all testimonials as a responsive card grid.
 * Falls back to placeholder testimonials when content.items is empty.
 */
export function TestimonialsCards({ content }: TestimonialsCardsProps) {
  const items =
    content.items.length > 0 ? content.items : PLACEHOLDER_TESTIMONIALS;

  return (
    <section
      className="w-full py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          className="mb-12 text-center text-3xl font-bold"
          style={{ color: "var(--color-heading)" }}
        >
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-2xl p-6"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                className="mb-4 text-5xl leading-none"
                style={{ color: "var(--color-primary)" }}
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p
                className="mb-6 flex-1 text-base leading-relaxed"
                style={{ color: "var(--color-body)" }}
              >
                {item.quote}
              </p>
              <div className="mt-auto">
                {item.rating !== undefined && (
                  <div className="mb-2">
                    <StarRating rating={item.rating} />
                  </div>
                )}
                <p
                  className="font-bold"
                  style={{ color: "var(--color-heading)" }}
                >
                  {item.author}
                </p>
                {item.role && (
                  <p className="text-sm" style={{ color: "var(--color-body)" }}>
                    {item.role}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
