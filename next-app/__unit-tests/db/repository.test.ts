import { describe, it, expect, beforeEach, vi } from "vitest";

// Hold a reference to the current test DB — set fresh in each beforeEach

let _testDb: ReturnType<typeof import("./testDb").createTestDb>["db"];

vi.mock("../../src/db/index", () => ({
  get db() {
    return _testDb;
  },
}));

import { createTestDb } from "./testDb";
import {
  createBatch,
  getBatch,
  listBatches,
  createProspects,
  listProspects,
  getProspectBySlug,
  updateProspect,
  createMedia,
  getSetting,
  setSetting,
} from "../../src/db/repository";

beforeEach(() => {
  _testDb = createTestDb().db;
});

// ---------------------------------------------------------------------------
// Batch tests
// ---------------------------------------------------------------------------

describe("batch repository", () => {
  it("createBatch returns object with id and timestamps", async () => {
    const batch = await createBatch({
      id: "batch-1",
      name: "Test Batch",
      industry: "plumbing",
      createdAt: Date.now(),
    });
    expect(batch.id).toBe("batch-1");
    expect(batch.name).toBe("Test Batch");
    expect(batch.createdAt).toBeTypeOf("number");
  });

  it("createBatch generates an id when not provided", async () => {
    const batch = await createBatch({
      name: "Auto ID Batch",
      industry: "hvac",
      createdAt: Date.now(),
    } as Parameters<typeof createBatch>[0]);
    expect(batch.id).toBeTruthy();
    expect(typeof batch.id).toBe("string");
  });

  it("listBatches returns all created batches", async () => {
    await createBatch({
      id: "b1",
      name: "Batch One",
      industry: "plumbing",
      createdAt: Date.now(),
    });
    await createBatch({
      id: "b2",
      name: "Batch Two",
      industry: "hvac",
      createdAt: Date.now(),
    });
    const all = await listBatches();
    expect(all).toHaveLength(2);
    expect(all.map((b) => b.id)).toContain("b1");
    expect(all.map((b) => b.id)).toContain("b2");
  });

  it("getBatch returns the correct batch by id", async () => {
    await createBatch({
      id: "batch-get",
      name: "Findable",
      industry: "electrical",
      createdAt: 1234567890,
    });
    const found = await getBatch("batch-get");
    expect(found).toBeDefined();
    expect(found?.name).toBe("Findable");
  });

  it("getBatch returns undefined for unknown id", async () => {
    const result = await getBatch("does-not-exist");
    expect(result).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Prospect tests
// ---------------------------------------------------------------------------

const BATCH_SEED = {
  id: "seed-batch",
  name: "Seed Batch",
  industry: "plumbing",
  createdAt: Date.now(),
};

/** Helper that seeds a batch before each prospect test needs one */
async function seedBatch() {
  return createBatch(BATCH_SEED);
}

function makeProspect(
  overrides: Partial<Parameters<typeof createProspects>[0][0]> = {},
): Parameters<typeof createProspects>[0][0] {
  return {
    id: crypto.randomUUID(),
    batchId: BATCH_SEED.id,
    slug: `prospect-${Math.random().toString(36).slice(2)}`,
    businessName: "Acme Plumbing",
    industry: "plumbing",
    location: "Austin, TX",
    status: "pending" as const,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe("prospect repository", () => {
  beforeEach(async () => {
    await seedBatch();
  });

  it("createProspects inserts all and returns them", async () => {
    const input = [
      makeProspect({ slug: "slug-a", businessName: "Alpha" }),
      makeProspect({ slug: "slug-b", businessName: "Beta" }),
    ];
    const results = await createProspects(input);
    expect(results).toHaveLength(2);
    expect(results[0].businessName).toBe("Alpha");
    expect(results[1].businessName).toBe("Beta");
  });

  it("listProspects filters by batchId", async () => {
    // Create a second batch
    await createBatch({
      id: "other-batch",
      name: "Other",
      industry: "hvac",
      createdAt: Date.now(),
    });
    await createProspects([
      makeProspect({ slug: "in-seed", batchId: BATCH_SEED.id }),
      makeProspect({ slug: "in-other", batchId: "other-batch" }),
    ]);
    const inSeed = await listProspects(BATCH_SEED.id);
    expect(inSeed).toHaveLength(1);
    expect(inSeed[0].slug).toBe("in-seed");
  });

  it("getProspectBySlug finds a prospect by slug", async () => {
    await createProspects([
      makeProspect({ slug: "findable-slug", businessName: "FindMe" }),
    ]);
    const found = await getProspectBySlug("findable-slug");
    expect(found).toBeDefined();
    expect(found?.businessName).toBe("FindMe");
  });

  it("getProspectBySlug returns undefined for unknown slug", async () => {
    const result = await getProspectBySlug("nope");
    expect(result).toBeUndefined();
  });

  it("updateProspect patches only the specified fields", async () => {
    const [p] = await createProspects([
      makeProspect({
        slug: "patchable",
        businessName: "Original",
        phone: null,
      }),
    ]);
    await updateProspect(p.id, { businessName: "Updated", phone: "555-1234" });
    const [updated] = await listProspects(BATCH_SEED.id);
    expect(updated.businessName).toBe("Updated");
    expect(updated.phone).toBe("555-1234");
    // Untouched field
    expect(updated.industry).toBe("plumbing");
  });

  it("updateProspect serialises JSON blob fields", async () => {
    const [p] = await createProspects([makeProspect({ slug: "json-test" })]);
    const fakeConfig = { palette: "ocean", sections: [] };
    await updateProspect(p.id, { siteConfig: fakeConfig as unknown as string });
    const [updated] = await listProspects(BATCH_SEED.id);
    expect(updated.siteConfig).toEqual(fakeConfig);
  });
});

// ---------------------------------------------------------------------------
// Media tests
// ---------------------------------------------------------------------------

describe("media repository", () => {
  beforeEach(async () => {
    await createBatch(BATCH_SEED);
  });

  it("createMedia returns the created row with an id", async () => {
    const row = await createMedia({
      id: crypto.randomUUID(),
      batchId: BATCH_SEED.id,
      filename: "hero.jpg",
      slot: "hero",
      industry: "plumbing",
      path: "/uploads/hero.jpg",
      createdAt: Date.now(),
    });
    expect(row.id).toBeTruthy();
    expect(row.filename).toBe("hero.jpg");
  });
});

// ---------------------------------------------------------------------------
// Settings tests
// ---------------------------------------------------------------------------

describe("settings repository", () => {
  it("setSetting creates a new setting", async () => {
    await setSetting("test_key", "test_value");
    const val = await getSetting("test_key");
    expect(val).toBe("test_value");
  });

  it("setSetting updates an existing setting", async () => {
    await setSetting("upsert_key", "first");
    await setSetting("upsert_key", "second");
    const val = await getSetting("upsert_key");
    expect(val).toBe("second");
  });

  it("getSetting returns undefined for an unknown key", async () => {
    const val = await getSetting("no_such_key");
    expect(val).toBeUndefined();
  });
});
