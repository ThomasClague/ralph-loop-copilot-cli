export interface PexelsPhoto {
  url: string;
  alt: string;
  photographer: string;
}

/**
 * Search Pexels for photos matching a query.
 * Returns an empty array on error — never throws.
 */
export async function searchPhotos(
  query: string,
  perPage = 5,
  orientation: "landscape" | "square" = "landscape",
): Promise<PexelsPhoto[]> {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=${orientation}`;
    const res = await fetch(url, {
      headers: { Authorization: process.env.PEXELS_API_KEY! },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.photos ?? []).map((p: { src: { large: string }; alt: string; photographer: string }) => ({
      url: p.src.large,
      alt: p.alt || query,
      photographer: p.photographer,
    }));
  } catch {
    return [];
  }
}
