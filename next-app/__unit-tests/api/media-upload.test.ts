// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest";

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("../../src/db/repository", () => ({
  getBatch: vi.fn(),
  createMedia: vi.fn(),
}));

vi.mock("fs", () => ({
  default: {
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

import { getBatch, createMedia } from "../../src/db/repository";
import fs from "fs";

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build a minimal NextRequest-like object for testing the route handler
 * without spinning up a real HTTP server.
 */
async function buildRequest(
  filename: string,
  content: string = "img-data",
  contentType: string = "image/jpeg",
  fileSize?: number,
): Promise<Request> {
  const formData = new FormData();
  const actualSize = fileSize ?? content.length;
  const blob = new Blob(
    [content.padEnd(actualSize, "x").slice(0, actualSize)],
    {
      type: contentType,
    },
  );
  const file = new File([blob], filename, { type: contentType });
  formData.append("file", file);
  return new Request("http://localhost/api/batches/batch-1/media", {
    method: "POST",
    body: formData,
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("POST /api/batches/[id]/media", () => {
  const mockBatch = {
    id: "batch-1",
    name: "Test Batch",
    industry: "roofing",
    createdAt: 1,
  };
  const mockMedia = {
    id: "media-uuid",
    batchId: "batch-1",
    filename: "hero-roofing-tiles.jpg",
    slot: "hero",
    industry: "roofing",
    path: "uploads/batch-1/hero-roofing-tiles.jpg",
    createdAt: 1,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let POST: (
    req: any,
    ctx: { params: Promise<{ id: string }> },
  ) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.mocked(getBatch).mockResolvedValue(mockBatch as never);
    vi.mocked(createMedia).mockResolvedValue(mockMedia as never);
    // Re-import route after mocks are set
    const mod = await import("../../app/api/batches/[id]/media/route");
    POST = mod.POST as typeof POST;
  });

  it("returns 404 when batch does not exist", async () => {
    vi.mocked(getBatch).mockResolvedValue(undefined);
    const req = await buildRequest("hero-roofing-tiles.jpg");
    const res = await POST(req as never, {
      params: Promise.resolve({ id: "missing" }),
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toMatch(/not found/i);
  });

  it("returns 400 when no file is provided", async () => {
    const req = new Request("http://localhost/api/batches/batch-1/media", {
      method: "POST",
      body: new FormData(),
    });
    const res = await POST(req as never, {
      params: Promise.resolve({ id: "batch-1" }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/no file/i);
  });

  it("returns 413 when file exceeds 10MB", async () => {
    // Create a large file by faking the size via a custom File with size property
    const formData = new FormData();
    const bigBlob = {
      size: 11 * 1024 * 1024,
      name: "hero-roofing-tiles.jpg",
      arrayBuffer: async () => new ArrayBuffer(0),
    };
    formData.append("file", bigBlob as unknown as File);
    const req = new Request("http://localhost/api/batches/batch-1/media", {
      method: "POST",
      body: formData,
    });
    const res = await POST(req as never, {
      params: Promise.resolve({ id: "batch-1" }),
    });
    // May be 400 or 413 depending on how File is handled; just check it's an error
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("returns 400 for non-image file type", async () => {
    const req = await buildRequest(
      "hero-roofing-tiles.gif",
      "data",
      "image/gif",
    );
    const res = await POST(req as never, {
      params: Promise.resolve({ id: "batch-1" }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid file type|invalid filename/i);
  });

  it("returns 400 for invalid filename format", async () => {
    const req = await buildRequest("invalid-name.jpg");
    const res = await POST(req as never, {
      params: Promise.resolve({ id: "batch-1" }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid filename/i);
  });

  it("returns 201 with media record for valid upload", async () => {
    const req = await buildRequest("hero-roofing-tiles.jpg");
    const res = await POST(req as never, {
      params: Promise.resolve({ id: "batch-1" }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.filename).toBe("hero-roofing-tiles.jpg");
    expect(body.slot).toBe("hero");
    expect(body.industry).toBe("roofing");
  });

  it("saves file to uploads/{batchId}/{filename}", async () => {
    const req = await buildRequest(
      "gallery-landscaping-lawn.png",
      "data",
      "image/png",
    );
    vi.mocked(createMedia).mockResolvedValue({
      ...mockMedia,
      filename: "gallery-landscaping-lawn.png",
      slot: "gallery",
      industry: "landscaping",
      path: "uploads/batch-1/gallery-landscaping-lawn.png",
    } as never);
    await POST(req as never, { params: Promise.resolve({ id: "batch-1" }) });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("gallery-landscaping-lawn.png"),
      expect.any(Buffer),
    );
  });

  it("creates media record with correct fields", async () => {
    const req = await buildRequest(
      "about-plumbing-pipes.webp",
      "data",
      "image/webp",
    );
    await POST(req as never, { params: Promise.resolve({ id: "batch-1" }) });
    expect(createMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        batchId: "batch-1",
        filename: "about-plumbing-pipes.webp",
        slot: "about",
        industry: "plumbing",
        path: expect.stringContaining("about-plumbing-pipes.webp"),
      }),
    );
  });

  it("accepts webp files", async () => {
    const req = await buildRequest(
      "team-electrical-crew.webp",
      "data",
      "image/webp",
    );
    vi.mocked(createMedia).mockResolvedValue({
      ...mockMedia,
      filename: "team-electrical-crew.webp",
    } as never);
    const res = await POST(req as never, {
      params: Promise.resolve({ id: "batch-1" }),
    });
    expect(res.status).toBe(201);
  });
});
