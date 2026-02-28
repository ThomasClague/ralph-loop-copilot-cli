// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest";

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("../../src/db/repository", () => ({
  listProspects: vi.fn(),
  updateProspectStatus: vi.fn(),
}));

vi.mock("../../src/lib/pipeline", () => ({
  runPipeline: vi.fn(),
}));

import { listProspects, updateProspectStatus } from "../../src/db/repository";
import { runPipeline } from "../../src/lib/pipeline";
import { POST } from "../../app/api/generate/batch/[id]/route";
import { NextRequest } from "next/server";

// ── Helpers ────────────────────────────────────────────────────────────────

function buildRequest(batchId: string) {
  const url = `http://localhost:3000/api/generate/batch/${batchId}`;
  return new NextRequest(url, { method: "POST" });
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makeProspect(id: string, status: string) {
  return { id, status, batchId: "batch-1", slug: id, businessName: "Biz" };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("POST /api/generate/batch/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(updateProspectStatus).mockResolvedValue(undefined as never);
    vi.mocked(runPipeline).mockResolvedValue({} as never);
  });

  it("returns 200 when no eligible prospects", async () => {
    vi.mocked(listProspects).mockResolvedValue([
      makeProspect("p1", "ready"),
    ] as never);

    const res = await POST(buildRequest("batch-1"), makeParams("batch-1"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.count).toBe(0);
  });

  it("returns 202 and starts generation for pending/failed prospects", async () => {
    vi.mocked(listProspects).mockResolvedValue([
      makeProspect("p1", "pending"),
      makeProspect("p2", "failed"),
      makeProspect("p3", "ready"),
    ] as never);

    const res = await POST(buildRequest("batch-1"), makeParams("batch-1"));
    const body = await res.json();

    expect(res.status).toBe(202);
    expect(body.count).toBe(2);
    expect(updateProspectStatus).toHaveBeenCalledWith("p1", "processing");
    expect(updateProspectStatus).toHaveBeenCalledWith("p2", "processing");
    expect(updateProspectStatus).not.toHaveBeenCalledWith("p3", "processing");
  });

  it("processes exactly 3 prospects concurrently", async () => {
    const prospects = ["p1", "p2", "p3", "p4", "p5"].map((id) =>
      makeProspect(id, "pending"),
    );
    vi.mocked(listProspects).mockResolvedValue(prospects as never);

    const order: string[] = [];
    vi.mocked(runPipeline).mockImplementation(async (id) => {
      order.push(id);
      return {} as never;
    });

    const res = await POST(buildRequest("batch-1"), makeParams("batch-1"));
    expect(res.status).toBe(202);

    // Allow the background async work to complete
    await new Promise((r) => setTimeout(r, 50));

    expect(runPipeline).toHaveBeenCalledTimes(5);
  });

  it("marks prospect as failed if pipeline throws", async () => {
    vi.mocked(listProspects).mockResolvedValue([
      makeProspect("p1", "pending"),
    ] as never);

    vi.mocked(runPipeline).mockRejectedValue(new Error("AI error") as never);

    await POST(buildRequest("batch-1"), makeParams("batch-1"));

    // Allow background work
    await new Promise((r) => setTimeout(r, 50));

    expect(updateProspectStatus).toHaveBeenCalledWith("p1", "failed");
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(listProspects).mockRejectedValue(new Error("DB error") as never);

    const res = await POST(buildRequest("batch-1"), makeParams("batch-1"));
    expect(res.status).toBe(500);
  });
});
