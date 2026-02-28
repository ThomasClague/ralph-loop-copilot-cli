import { ProcessContent, BusinessInfo } from "@/src/types/site";

interface ProcessStepsProps {
  content: ProcessContent;
  business: BusinessInfo;
}

const PLACEHOLDER_STEPS = [
  {
    number: 1,
    title: "Request a Quote",
    description:
      "Contact us online or by phone. We'll gather the details about your project needs.",
  },
  {
    number: 2,
    title: "We Assess & Plan",
    description:
      "Our team visits your site, evaluates the scope, and provides a clear written estimate.",
  },
  {
    number: 3,
    title: "Work Begins",
    description:
      "Our certified technicians arrive on schedule and complete the job to the highest standard.",
  },
  {
    number: 4,
    title: "Final Review",
    description:
      "We walk you through the completed work and ensure you're 100% satisfied before we leave.",
  },
];

/**
 * ProcessSteps variant — horizontal row of numbered cards with arrow connectors.
 * Falls back to placeholder steps when content.steps is empty.
 */
export function ProcessSteps({ content }: ProcessStepsProps) {
  const steps = content.steps.length > 0 ? content.steps : PLACEHOLDER_STEPS;

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
          {content.headline || "How It Works"}
        </h2>

        {/* Steps row */}
        <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-start md:gap-0">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex md:flex-1 md:items-start">
              {/* Step card */}
              <div
                className="flex flex-1 flex-col items-center rounded-2xl p-6 text-center"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Circle with step number */}
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-inverted, #fff)",
                  }}
                >
                  {step.number}
                </div>
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "var(--color-heading)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-body)" }}
                >
                  {step.description}
                </p>
              </div>

              {/* Arrow connector — only between steps, hidden on mobile */}
              {idx < steps.length - 1 && (
                <div
                  className="hidden items-center px-3 pt-6 md:flex"
                  aria-hidden="true"
                >
                  <span
                    className="text-2xl"
                    style={{ color: "var(--color-primary)" }}
                  >
                    →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
