import { describe, it, expect, vi, beforeEach } from 'vitest';
import { crawlUrl, checkScraperHealth } from '../client';
import type { CrawlResult } from '../types';

const mockCrawlResult: CrawlResult = {
  success: true,
  pages: [
    {
      url: 'https://example.com',
      title: 'Example',
      metaDescription: 'An example site',
      headings: { h1: ['Hello'] },
      bodyText: 'Some body text',
      links: ['https://example.com/about'],
      images: [{ src: 'https://example.com/logo.png', alt: 'Logo' }],
      phones: ['555-1234'],
      emails: ['info@example.com'],
    },
  ],
  branding: { colors: ['#fff'], fonts: ['Arial'], logoUrl: 'https://example.com/logo.png' },
};

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe('checkScraperHealth', () => {
  it('returns true when health endpoint responds ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    const result = await checkScraperHealth();
    expect(result).toBe(true);
  });

  it('returns false when health endpoint responds not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const result = await checkScraperHealth();
    expect(result).toBe(false);
  });
});

describe('crawlUrl', () => {
  it('returns structured crawl data on success', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true }) // health check
      .mockResolvedValueOnce({ json: async () => mockCrawlResult }); // crawl
    vi.stubGlobal('fetch', mockFetch);

    const result = await crawlUrl('https://example.com');
    expect(result).toEqual(mockCrawlResult);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenLastCalledWith(
      expect.stringContaining('/api/crawl'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws when scraping server is unreachable (health check throws)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));
    await expect(crawlUrl('https://example.com')).rejects.toThrow(
      'Scraping server not running',
    );
  });

  it('throws when health check returns not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false }),
    );
    await expect(crawlUrl('https://example.com')).rejects.toThrow(
      'Scraping server not running',
    );
  });

  it('returns error object when crawl endpoint returns 400', async () => {
    const errorResult: CrawlResult = { success: false, pages: [], branding: { colors: [], fonts: [], logoUrl: null }, error: 'Invalid URL' };
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true }) // health check
      .mockResolvedValueOnce({ json: async () => errorResult }); // crawl returns error payload
    vi.stubGlobal('fetch', mockFetch);

    const result = await crawlUrl('not-a-url');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid URL');
  });
});
