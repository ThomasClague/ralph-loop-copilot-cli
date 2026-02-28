import { BlogPreviewCards } from "@/src/components/shared/blog_preview";

export default function TestBlogPreviewPage() {
  return (
    <div style={{ "--color-bg": "#ffffff", "--color-surface": "#f9fafb", "--color-border": "#e5e7eb", "--color-heading": "#111827", "--color-text": "#374151", "--color-primary": "#2563eb" } as React.CSSProperties}>
      <BlogPreviewCards
        content={{
          headline: "From Our Blog",
          posts: [
            { title: "Plumbing Tips for Winter", excerpt: "Cold weather can wreak havoc on your pipes. Learn how to protect your plumbing system and avoid expensive emergency repairs this winter season.", date: "Jan 10, 2025" },
            { title: "Signs of a Water Leak", excerpt: "Early detection is the best way to prevent water damage. Discover the subtle signs that indicate a hidden leak in your walls or floors.", date: "Feb 5, 2025" },
            { title: "When to Replace a Water Heater", excerpt: "Most water heaters last 8-12 years. Here is how to tell when yours is nearing the end of its life and it is time for a replacement.", date: "Mar 1, 2025" },
          ],
        }}
        business={{ name: "Joe Plumbing", phone: "555-0100", email: "joe@plumbing.com", location: "Austin, TX", industry: "plumbing" }}
      />
      <BlogPreviewCards
        content={{ headline: "", posts: [] }}
        business={{ name: "Joe Plumbing", phone: "555-0100", email: "joe@plumbing.com", location: "Austin, TX", industry: "plumbing" }}
      />
    </div>
  );
}
