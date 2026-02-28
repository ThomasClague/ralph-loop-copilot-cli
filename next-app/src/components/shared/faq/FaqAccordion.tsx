"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqContent, BusinessInfo } from "@/src/types/site";

interface FaqAccordionProps {
  content: FaqContent;
  business: BusinessInfo;
}

const PLACEHOLDER_ITEMS = [
  {
    question: "What services do you offer?",
    answer:
      "We offer a comprehensive range of professional services tailored to meet your needs. Contact us to learn more.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Getting a quote is easy! Simply reach out to us by phone or through our contact form and we will respond promptly.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes, we are fully licensed and insured. Your satisfaction and safety are our top priorities.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve the local area and surrounding communities. Contact us to confirm availability in your location.",
  },
];

/**
 * FaqAccordion — expandable/collapsible FAQ using shadcn/ui Accordion.
 * One item open at a time (type="single" collapsible).
 */
export function FaqAccordion({ content, business }: FaqAccordionProps) {
  const items =
    content.items && content.items.length > 0
      ? content.items
      : PLACEHOLDER_ITEMS;

  return (
    <section
      className="w-full py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-3xl px-6">
        <h2
          className="mb-10 text-center text-3xl font-bold"
          style={{ color: "var(--color-heading)" }}
        >
          {content.headline || `Frequently Asked Questions`}
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {items.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="rounded-lg px-4"
              style={{
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <AccordionTrigger
                className="text-left font-semibold hover:no-underline"
                style={{ color: "var(--color-heading)" }}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent
                style={{ color: "var(--color-text)" }}
                className="pb-4 leading-relaxed"
              >
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

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
