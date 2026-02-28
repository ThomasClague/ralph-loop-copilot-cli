import { BlogPreviewContent, BusinessInfo } from "@/src/types/site";

interface BlogPreviewCardsProps {
  content: BlogPreviewContent;
  business: BusinessInfo;
}

const PLACEHOLDER_POSTS = [
  {
    title: "5 Signs You Need a Professional Service",
    excerpt:
      "Regular maintenance can prevent costly repairs down the line. Here are the top warning signs that it's time to call in a professional.",
    date: "March 10, 2025",
    imageUrl: undefined,
  },
  {
    title: "How to Choose the Right Contractor",
    excerpt:
      "Finding a trustworthy contractor doesn't have to be difficult. Learn what questions to ask and what red flags to watch for before hiring.",
    date: "February 22, 2025",
    imageUrl: undefined,
  },
  {
    title: "Our Top Tips for Seasonal Preparation",
    excerpt:
      "Preparing your home for seasonal changes is key to avoiding emergencies. Follow our expert checklist to stay ahead of potential problems.",
    date: "January 15, 2025",
    imageUrl: undefined,
  },
];

/**
 * BlogPreviewCards — displays up to 3 blog post preview cards.
 * Each card shows an optional image, date, title, truncated excerpt, and a "Read More" link.
 */
export function BlogPreviewCards({ content }: BlogPreviewCardsProps) {
  const posts = content.posts?.length
    ? content.posts.slice(0, 3)
    : PLACEHOLDER_POSTS;

  return (
    <section
      className="w-full py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {content.headline && (
          <h2
            className="mb-10 text-center text-3xl font-bold"
            style={{ color: "var(--color-heading)" }}
          >
            {content.headline}
          </h2>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post, idx) => (
            <article
              key={idx}
              className="flex flex-col overflow-hidden rounded-xl transition-shadow duration-200 hover:shadow-lg"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              {post.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <p
                  className="mb-2 text-sm"
                  style={{ color: "var(--color-text)", opacity: 0.6 }}
                >
                  {post.date}
                </p>

                <h3
                  className="mb-3 text-lg font-semibold leading-snug"
                  style={{ color: "var(--color-heading)" }}
                >
                  {post.title}
                </h3>

                <p
                  className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed"
                  style={{ color: "var(--color-text)" }}
                >
                  {post.excerpt}
                </p>

                <a
                  href="#"
                  className="mt-auto text-sm font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  Read More →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
