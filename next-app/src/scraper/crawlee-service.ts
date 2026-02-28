import { CheerioCrawler, Configuration, LogLevel } from "crawlee";
import { extractBranding } from "./branding";
import type { BrandingData } from "./types";

// Suppress verbose crawlee logs
Configuration.getGlobalConfig().set("logLevel", LogLevel.WARNING);

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export interface RawPage {
  url: string;
  html: string;
  title: string;
}

export interface CrawlSiteResult {
  pages: RawPage[];
  branding: BrandingData;
}

/**
 * Crawls a site starting at `url`, following only same-domain internal links.
 * Returns raw page data for up to `maxPages` pages or until the 30s timeout fires.
 */
export async function crawlSite(
  url: string,
  maxPages = 10,
): Promise<CrawlSiteResult> {
  const baseDomain = new URL(url).hostname;
  const pages: RawPage[] = [];

  const crawler = new CheerioCrawler({
    maxRequestsPerCrawl: maxPages,
    maxConcurrency: 3,
    requestHandlerTimeoutSecs: 30,
    navigationTimeoutSecs: 30,
    additionalMimeTypes: ["text/html"],
    preNavigationHooks: [
      async (crawlingContext) => {
        crawlingContext.request.headers = {
          ...crawlingContext.request.headers,
          "User-Agent": USER_AGENT,
        };
      },
    ],
    async requestHandler({ request, $, enqueueLinks }) {
      pages.push({
        url: request.url,
        html: $.html(),
        title: $("title").text().trim(),
      });

      await enqueueLinks({
        transformRequestFunction(req) {
          try {
            const linkHostname = new URL(req.url).hostname;
            return linkHostname === baseDomain ? req : false;
          } catch {
            return false;
          }
        },
      });
    },
  });

  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 30_000));

  await Promise.race([crawler.run([url]), timeout]);

  // Ensure the crawler is torn down (no-op if already done)
  await crawler.teardown();

  const homepagePage = pages.find((p) => p.url === url) ?? pages[0];
  const branding = homepagePage
    ? extractBranding(homepagePage.html, url)
    : { colors: [], fonts: [], logoUrl: null };

  return { pages, branding };
}
