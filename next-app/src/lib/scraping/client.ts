import type { CrawlResult } from './types';

const SCRAPER_URL = process.env.SCRAPER_URL || 'http://localhost:3001';

export async function checkScraperHealth(): Promise<boolean> {
  const res = await fetch(`${SCRAPER_URL}/api/health`);
  return res.ok;
}

export async function crawlUrl(url: string, maxPages = 10): Promise<CrawlResult> {
  const healthy = await checkScraperHealth().catch(() => false);
  if (!healthy) throw new Error('Scraping server not running. Start it with npm run dev.');
  const res = await fetch(`${SCRAPER_URL}/api/crawl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, maxPages }),
  });
  return res.json();
}
