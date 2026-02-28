import express, { Request, Response, NextFunction } from "express";
import * as cheerio from "cheerio";
import { crawlSite } from "./crawlee-service";
import { extractPageData } from "./extract";

const app = express();
const PORT = process.env.SCRAPER_PORT ? parseInt(process.env.SCRAPER_PORT) : 3001;

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

/** POST /api/crawl — accepts { url, maxPages? }, returns { success, pages, branding } */
app.post("/api/crawl", async (req: Request, res: Response) => {
  const { url, maxPages = 10 } = req.body as {
    url?: string;
    maxPages?: number;
  };

  if (!url) {
    res.status(400).json({ success: false, error: "Invalid URL" });
    return;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    res.status(400).json({ success: false, error: "Invalid URL" });
    return;
  }

  const start = Date.now();
  console.log("Crawling", url);

  try {
    const { pages: rawPages, branding } = await crawlSite(
      parsedUrl.href,
      maxPages,
    );

    const pages = rawPages.map((raw) => {
      const $ = cheerio.load(raw.html);
      return extractPageData($, raw.url, raw.html);
    });

    const elapsed = Date.now() - start;
    console.log("Crawling", url, "- completed in", elapsed, "ms");

    res.json({ success: true, pages, branding });
  } catch (err) {
    console.error("Crawl failed:", err);
    const message = err instanceof Error ? err.message : "Crawl failed";
    res.status(500).json({ success: false, error: message });
  }
});

/** Global error handler */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`Scraping API running on port ${PORT}`);
});

export default app;
