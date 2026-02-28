import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { searchPhotos } from "../../src/lib/images/pexels";

function makeMockResponse(photos: unknown[]) {
  return {
    ok: true,
    json: async () => ({ photos }),
  } as Response;
}

const samplePexelsPhoto = {
  src: { large: "https://images.pexels.com/photos/1/photo.jpg" },
  alt: "A roofing contractor on a roof",
  photographer: "John Doe",
};

describe("searchPhotos", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env.PEXELS_API_KEY = "test-key";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.PEXELS_API_KEY;
  });

  it("returns photo objects with url, alt, and photographer", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeMockResponse([samplePexelsPhoto]));

    const results = await searchPhotos("roofing contractor");

    expect(results).toHaveLength(1);
    expect(results[0].url).toBe("https://images.pexels.com/photos/1/photo.jpg");
    expect(results[0].alt).toBe("A roofing contractor on a roof");
    expect(results[0].photographer).toBe("John Doe");
  });

  it("uses Authorization header from PEXELS_API_KEY", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeMockResponse([samplePexelsPhoto]));

    await searchPhotos("plumbing");

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({ Authorization: "test-key" });
  });

  it("returns empty array on non-ok response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);

    const results = await searchPhotos("hvac");
    expect(results).toEqual([]);
  });

  it("returns empty array on network error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network fail"));

    const results = await searchPhotos("electrician");
    expect(results).toEqual([]);
  });

  it("defaults alt to query when photo alt is empty", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      makeMockResponse([{ ...samplePexelsPhoto, alt: "" }]),
    );

    const results = await searchPhotos("landscaping");
    expect(results[0].alt).toBe("landscaping");
  });

  it("respects perPage parameter in request URL", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeMockResponse([]));

    await searchPhotos("painting", 10);

    const [url] = vi.mocked(fetch).mock.calls[0];
    expect(url as string).toContain("per_page=10");
  });

  it("uses landscape orientation by default", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeMockResponse([]));

    await searchPhotos("fencing");

    const [url] = vi.mocked(fetch).mock.calls[0];
    expect(url as string).toContain("orientation=landscape");
  });

  it("supports square orientation override", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeMockResponse([]));

    await searchPhotos("gallery images", 5, "square");

    const [url] = vi.mocked(fetch).mock.calls[0];
    expect(url as string).toContain("orientation=square");
  });
});
