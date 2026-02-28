import { ProcessContent, BusinessInfo } from "@/src/types/site";

interface ProcessTimelineProps {
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
 * ProcessTimeline variant — vertical timeline with alternating left/right cards.
 * Falls back to placeholder steps when content.steps is empty.
 */
export function ProcessTimeline({ content }: ProcessTimelineProps) {
  const steps = content.steps.length > 0 ? content.steps : PLACEHOLDER_STEPS;

  return (
    <section
      className="w-full py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-4xl px-6">
        <h2
          className="mb-12 text-center text-3xl font-bold"
          style={{ color: "var(--color-heading)" }}
        >
          {content.headline || "How It Works"}
        </h2>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical center line — visible on md+ */}
          <div
            className="absolute left-6 top-0 hidden h-full w-0.5 md:left-1/2 md:block md:-translate-x-1/2"
            style={{ backgroundColor: "var(--color-border)" }}
            aria-hidden="true"
          />

          {/* Mobile: left-aligned line */}
          <div
            className="absolute left-6 top-0 h-full w-0.5 md:hidden"
            style={{ backgroundColor: "var(--color-border)" }}
            aria-hidden="true"
          />

          <div className="flex flex-col gap-10">
            {steps.map((step, idx) => {
              const isRight = idx % 2 === 0;
              return (
                <div
                  key={step.number}
                  className="relative flex items-start gap-6 md:items-center"
                >
                  {/* Mobile layout: number circle + card right of line */}
                  <div className="flex w-full items-start gap-6 md:hidden">
                    <div
                      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-text-inverted, #fff)",
                      }}
                    >
                      {step.number}
                    </div>
                    <div
                      className="flex-1 rounded-2xl p-5"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <h3
                        className="mb-1 text-lg font-semibold"
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
                  </div>

                  {/* Desktop alternating layout */}
                  <div className="hidden w-full md:flex md:items-center md:gap-0">
                    {/* Left side content or spacer */}
                    <div
                      className={`flex flex-1 ${isRight ? "justify-end pr-8" : "pl-8"}`}
                    >
                      {!isRight && (
                        <div
                          className="w-full max-w-xs rounded-2xl p-5"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <h3
                            className="mb-1 text-lg font-semibold"
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
                      )}
                    </div>

                    {/* Center circle */}
                    <div
                      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-text-inverted, #fff)",
                      }}
                    >
                      {step.number}
                    </div>

                    {/* Right side content or spacer */}
                    <div
                      className={`flex flex-1 ${!isRight ? "justify-start pl-8" : "pr-8"}`}
                    >
                      {isRight && (
                        <div
                          className="w-full max-w-xs rounded-2xl p-5"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <h3
                            className="mb-1 text-lg font-semibold"
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
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
