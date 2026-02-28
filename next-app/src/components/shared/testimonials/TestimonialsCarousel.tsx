"use client";

import { useState } from "react";
import { TestimonialsContent, BusinessInfo } from "@/src/types/site";

interface TestimonialsCarouselProps {
  content: TestimonialsContent;
  business: BusinessInfo;
}

/** Renders 1–5 filled stars based on rating value. */
function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex justify-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="text-2xl"
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
 * Testimonials carousel variant — displays one testimonial at a time with prev/next navigation
 * and dot indicators. Falls back to placeholder testimonials when content.items is empty.
 */
export function TestimonialsCarousel({ content }: TestimonialsCarouselProps) {
  const items =
    content.items.length > 0 ? content.items : PLACEHOLDER_TESTIMONIALS;
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  const next = () => setCurrent((c) => (c + 1) % items.length);

  const item = items[current];

  return (
    <section
      className="w-full py-16"
      style={{
        backgroundColor: "var(--color-surface-alt, var(--color-surface))",
      }}
    >
      <div className="mx-auto max-w-3xl px-6">
        <h2
          className="mb-12 text-center text-3xl font-bold"
          style={{ color: "var(--color-heading)" }}
        >
          What Our Customers Say
        </h2>

        <div
          className="rounded-2xl p-10 text-center"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <span
            className="mb-4 block text-6xl leading-none"
            style={{ color: "var(--color-primary)" }}
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p
            className="mb-8 text-xl leading-relaxed"
            style={{ color: "var(--color-body)" }}
          >
            {item.quote}
          </p>
          {item.rating !== undefined && (
            <div className="mb-4">
              <StarRating rating={item.rating} />
            </div>
          )}
          <p
            className="text-lg font-bold"
            style={{ color: "var(--color-heading)" }}
          >
            {item.author}
          </p>
          {item.role && (
            <p className="mt-1 text-sm" style={{ color: "var(--color-body)" }}>
              {item.role}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl transition-opacity hover:opacity-70"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-heading)",
            }}
          >
            ‹
          </button>

          {/* Dot indicators */}
          <div
            className="flex gap-2"
            aria-label={`Testimonial ${current + 1} of ${items.length}`}
          >
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className="h-2.5 w-2.5 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    idx === current
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl transition-opacity hover:opacity-70"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-heading)",
            }}
          >
            ›
          </button>
        </div>

        <p
          className="mt-4 text-center text-sm"
          style={{ color: "var(--color-body)" }}
        >
          {current + 1} / {items.length}
        </p>
      </div>
    </section>
  );
}
