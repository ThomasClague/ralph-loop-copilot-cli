import { expect, test } from "@playwright/test";
import { BatchDetailPage } from "./pages/BatchDetailPage";

test.describe("Generation flow", () => {
  let batchId: string;

  test.afterEach(async ({ request }) => {
    if (batchId) {
      await request.delete(`/api/batches/${batchId}`);
    }
  });

  test("generates all pending prospects and shows Preview link", async ({
    page,
    request,
  }) => {
    test.slow(); // Generation can take up to 120 seconds
    test.setTimeout(180_000);

    // Step 1: Create a batch and 1 prospect via API
    const batchRes = await request.post("/api/batches", {
      data: { name: "Generation Test Batch", industry: "roofing" },
    });
    expect(batchRes.status()).toBe(201);
    const batch = await batchRes.json();
    batchId = batch.id;

    const prospectRes = await request.post("/api/prospects", {
      data: {
        batchId,
        prospects: [
          {
            businessName: "Test Roofing Co",
            industry: "roofing",
            location: "London",
            existingUrl: "https://example.com",
          },
        ],
      },
    });
    expect(prospectRes.status()).toBe(201);

    // Step 2: Navigate to batch detail page and verify 1 pending prospect
    const batchDetailPage = new BatchDetailPage(page);
    await batchDetailPage.goto(batchId);

    const count = await batchDetailPage.getProspectCount();
    expect(count).toBe(1);

    const initialStatus =
      await batchDetailPage.getProspectStatus("Test Roofing Co");
    expect(initialStatus.toLowerCase()).toBe("pending");

    // Step 3: Click Generate All Pending
    await batchDetailPage.clickGenerate();

    // Step 4: Poll until status becomes 'ready' (up to 120 seconds)
    await expect
      .poll(
        async () => {
          const res = await request.get(`/api/batches/${batchId}/prospects`);
          const data = await res.json();
          const prospect = data.find(
            (p: { businessName: string }) =>
              p.businessName === "Test Roofing Co",
          );
          return prospect?.status;
        },
        { timeout: 120_000, intervals: [3000] },
      )
      .toBe("ready");

    // Step 5: Reload to pick up final state and verify Preview link
    await batchDetailPage.goto(batchId);
    await expect(page.getByRole("link", { name: /Preview/i })).toBeVisible();

    // Save screenshot for task verification
    await page.screenshot({
      path: ".agent/screenshots/TASK-99-1.png",
      fullPage: true,
    });
  });
});
