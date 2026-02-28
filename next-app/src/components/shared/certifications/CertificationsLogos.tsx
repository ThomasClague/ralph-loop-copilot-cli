import { CertificationsContent, BusinessInfo } from "@/src/types/site";

interface CertificationsLogosProps {
  content: CertificationsContent;
  business: BusinessInfo;
}

/**
 * CertificationsLogos — displays industry certifications, accreditations, and licenses.
 * Shows logo images when present, otherwise falls back to a styled text badge.
 */
export function CertificationsLogos({ content }: CertificationsLogosProps) {
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
          {content.headline || "Our Certifications"}
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {content.items.map((cert, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center rounded-xl p-5 text-center"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                minWidth: "140px",
                maxWidth: "180px",
              }}
            >
              {cert.imageUrl ? (
                <img
                  src={cert.imageUrl}
                  alt={cert.name}
                  className="mb-3 h-16 w-16 object-contain"
                />
              ) : (
                <div
                  className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg text-xs font-bold uppercase leading-tight"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-inverted)",
                    padding: "6px",
                  }}
                >
                  {cert.name.slice(0, 6)}
                </div>
              )}

              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-heading)" }}
              >
                {cert.name}
              </p>

              {cert.year && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--color-text)" }}
                >
                  Since {cert.year}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
