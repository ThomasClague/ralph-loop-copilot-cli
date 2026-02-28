import React from "react";
import { GuaranteeContent, BusinessInfo } from "@/src/types/site";

interface GuaranteeBadgeProps {
  content: GuaranteeContent;
  business: BusinessInfo;
}

export default function GuaranteeBadge({ content }: GuaranteeBadgeProps) {
  const badgeText = content.badgeText || "100%\nSatisfaction\nGuaranteed";

  return (
    <section
      className="py-16 px-4"
      style={{ background: "var(--color-bg, #fff)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Guarantee badge — circular stamp/seal */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div
            className="w-48 h-48 rounded-full flex items-center justify-center text-center font-bold text-lg leading-tight p-6"
            style={{
              border: "4px dashed var(--color-primary, #2563eb)",
              color: "var(--color-primary, #2563eb)",
              background: "var(--color-surface, #f9fafb)",
              boxShadow:
                "0 0 0 8px var(--color-bg, #fff), 0 0 0 10px var(--color-border, #e5e7eb)",
              whiteSpace: "pre-line",
            }}
          >
            {badgeText}
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 text-center md:text-left">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--color-heading, #111)" }}
          >
            {content.headline}
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--color-text, #374151)" }}
          >
            {content.body}
          </p>
        </div>
      </div>
    </section>
  );
}
