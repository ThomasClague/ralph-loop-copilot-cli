import { expect, test } from "@playwright/test";

test("generation trigger UI shows on batch detail page with pending prospects", async ({
  page,
}) => {
  // Create a batch via API
  const batchRes = await page.request.post("/api/batches", {
    data: { name: "E2E Trigger Test", industry: "roofing" },
  });
  expect(batchRes.status()).toBe(201);
  const batch = await batchRes.json();
  const batchId = batch.id;

  // Add prospects
  const prospectsRes = await page.request.post("/api/prospects", {
    data: {
      batchId,
      prospects: [
        {
          businessName: "Peak Roofing",
          industry: "roofing",
          location: "Phoenix, AZ",
        },
      ],
    },
  });
  expect(prospectsRes.status()).toBe(201);

  // Navigate to batch detail page
  await page.goto(`/batches/${batchId}`, { waitUntil: "networkidle" });

  // Generate All Pending button should be visible
  const generateBtn = page.getByRole("button", {
    name: /Generate All Pending/i,
  });
  await expect(generateBtn).toBeVisible();
  await expect(generateBtn).toBeEnabled();

  // Prospect table should be visible
  await expect(page.getByText("Peak Roofing")).toBeVisible();
  // Check status badge shows pending (use data-slot selector to be precise)
  await expect(
    page.locator('[data-slot="badge"]', { hasText: /pending/i }).first(),
  ).toBeVisible();

  // Polling endpoint should return prospects
  const pollRes = await page.request.get(`/api/batches/${batchId}/prospects`);
  expect(pollRes.status()).toBe(200);
  const prospects = await pollRes.json();
  expect(prospects).toHaveLength(1);
  expect(prospects[0].status).toBe("pending");
});
