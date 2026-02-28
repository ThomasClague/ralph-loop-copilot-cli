import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { extractPageData } from "../../src/scraper/extract";

const HTML = `<!DOCTYPE html>
<html>
  <head>
    <title>Test Page</title>
    <meta name="description" content="A test description" />
  </head>
  <body>
    <header>Header nav</header>
    <nav>Nav link</nav>
    <h1>Main Heading</h1>
    <h2>Sub Heading</h2>
    <p>Contact us at info@example.com or call 0800 123 4567 or +1 (555) 123-4567.</p>
    <a href="/about">About</a>
    <a href="https://external.com">External</a>
    <img src="/logo.png" alt="Logo" />
    <img src="data:image/png;base64,abc" alt="Data URI" />
    <script>var x = 1;</script>
    <footer>Footer text</footer>
  </body>
</html>`;

describe("extractPageData", () => {
  it("extracts title and meta description", () => {
    const $ = load(HTML);
    const result = extractPageData($, "https://example.com", HTML);
    expect(result.title).toBe("Test Page");
    expect(result.metaDescription).toBe("A test description");
  });

  it("extracts headings by level", () => {
    const $ = load(HTML);
    const result = extractPageData($, "https://example.com", HTML);
    expect(result.headings.h1).toEqual(["Main Heading"]);
    expect(result.headings.h2).toEqual(["Sub Heading"]);
    expect(result.headings.h3).toEqual([]);
  });

  it("extracts images, filtering data URIs", () => {
    const $ = load(HTML);
    const result = extractPageData($, "https://example.com", HTML);
    expect(result.images).toHaveLength(1);
    expect(result.images[0]).toEqual({ src: "/logo.png", alt: "Logo" });
  });

  it("extracts email addresses", () => {
    const $ = load(HTML);
    const result = extractPageData($, "https://example.com", HTML);
    expect(result.emails).toContain("info@example.com");
  });

  it("extracts phone numbers", () => {
    const $ = load(HTML);
    const result = extractPageData($, "https://example.com", HTML);
    expect(result.phones.length).toBeGreaterThanOrEqual(1);
  });

  it("returns empty arrays for missing fields", () => {
    const $ = load("<html><body></body></html>");
    const result = extractPageData($, "https://example.com", "");
    expect(result.headings.h1).toEqual([]);
    expect(result.images).toEqual([]);
    expect(result.phones).toEqual([]);
    expect(result.emails).toEqual([]);
  });

  it("caps body text at 10,000 characters", () => {
    const longText = "a".repeat(20000);
    const $ = load(`<html><body><p>${longText}</p></body></html>`);
    const result = extractPageData($, "https://example.com", "");
    expect(result.bodyText.length).toBeLessThanOrEqual(10000);
  });

  it("deduplicates emails and phones", () => {
    const dupHtml = `<html><body>info@example.com info@example.com 0800 123 4567 0800 123 4567</body></html>`;
    const $ = load(dupHtml);
    const result = extractPageData($, "https://example.com", dupHtml);
    expect(result.emails.filter((e) => e === "info@example.com")).toHaveLength(
      1,
    );
  });
});
