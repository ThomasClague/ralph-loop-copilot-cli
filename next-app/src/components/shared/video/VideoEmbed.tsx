import React from "react";
import { VideoContent, BusinessInfo } from "@/src/types/site";

interface VideoEmbedProps {
  content: VideoContent;
  business: BusinessInfo;
}

/** Converts a YouTube or Vimeo watch URL to an embeddable URL. */
function toEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube: https://www.youtube.com/watch?v=ID or https://youtu.be/ID
  const ytMatch =
    url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Vimeo: https://vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Already an embed URL — pass through
  if (url.includes("/embed/") || url.includes("player.vimeo.com")) {
    return url;
  }

  return null;
}

export default function VideoEmbed({ content }: VideoEmbedProps) {
  const embedUrl = toEmbedUrl(content.videoUrl);

  return (
    <section
      className="py-16 px-4"
      style={{ background: "var(--color-bg, #fff)" }}
    >
      <div className="max-w-4xl mx-auto">
        {content.headline && (
          <h2
            className="text-3xl font-bold text-center mb-8"
            style={{ color: "var(--color-heading, #111)" }}
          >
            {content.headline}
          </h2>
        )}

        {embedUrl ? (
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={embedUrl}
              title={content.headline}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : content.poster ? (
          /* Poster fallback when URL is not embeddable */
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.poster}
              alt={content.headline}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "var(--color-primary, #2563eb)" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-8 h-8 ml-1"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder when no valid URL or poster */
          <div
            className="aspect-video w-full rounded-lg flex items-center justify-center"
            style={{
              background: "var(--color-surface, #f9fafb)",
              border: "2px dashed var(--color-border, #e5e7eb)",
            }}
          >
            <span style={{ color: "var(--color-text, #6b7280)" }}>
              Video unavailable
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
