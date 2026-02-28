import { GalleryContent, BusinessInfo } from "@/src/types/site";

interface GalleryMasonryProps {
  content: GalleryContent;
  business: BusinessInfo;
}

const PLACEHOLDER_IMAGES: Array<{
  url: string;
  alt: string;
  caption?: string;
}> = [
  { url: "https://placehold.co/400x600?text=Photo+1", alt: "Gallery photo 1" },
  { url: "https://placehold.co/400x300?text=Photo+2", alt: "Gallery photo 2" },
  { url: "https://placehold.co/400x500?text=Photo+3", alt: "Gallery photo 3" },
  { url: "https://placehold.co/400x350?text=Photo+4", alt: "Gallery photo 4" },
  { url: "https://placehold.co/400x450?text=Photo+5", alt: "Gallery photo 5" },
  { url: "https://placehold.co/400x400?text=Photo+6", alt: "Gallery photo 6" },
];

/**
 * GalleryMasonry — Pinterest-style masonry layout using CSS columns.
 * Images have varied heights creating a natural flow. Caption shown on hover.
 */
export function GalleryMasonry({ content, business }: GalleryMasonryProps) {
  const images =
    content.images && content.images.length > 0
      ? content.images
      : PLACEHOLDER_IMAGES;

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
          {content.headline || `${business.name} Gallery`}
        </h2>

        <div className="columns-2 gap-4 md:columns-3">
          {images.map((image, idx) => (
            <div
              key={idx}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-lg"
              style={{ border: "1px solid var(--color-border)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Caption overlay on hover */}
              {image.caption && (
                <div
                  className="absolute inset-0 flex items-end opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                  }}
                >
                  <p className="w-full px-3 pb-3 text-sm text-white">
                    {image.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
