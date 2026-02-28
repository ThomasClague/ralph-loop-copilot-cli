import { expect, test } from "@playwright/test";

/**
 * E2E test for the email sending flow.
 * Uses mock mode (EMAIL_MODE=mock) — no real emails sent.
 */
test.describe("Email sending flow", () => {
  let batchId: string;
  let slug: string;

  test.beforeAll(async ({ request }) => {
    // 1. Create batch
    const batchRes = await request.post("/api/batches", {
      data: { name: "Email E2E Test Batch", industry: "roofing" },
    });
    expect(batchRes.status()).toBe(201);
    const batch = await batchRes.json();
    batchId = batch.id;

    // 2. Create prospect with email address
    const prospectRes = await request.post("/api/prospects", {
      data: {
        batchId,
        prospects: [
          {
            businessName: "Email Test Roofing Co",
            industry: "roofing",
            location: "London",
            existingUrl: "https://example.com",
            email: "test@emailroofing.example.com",
          },
        ],
      },
    });
    expect(prospectRes.status()).toBe(201);
    const prospectsData = await prospectRes.json();
    slug = prospectsData[0].slug;

    // 3. Patch prospect to status='ready' (skip full generation pipeline)
    const patchRes = await request.patch(`/api/prospects/${slug}`, {
      data: { status: "ready" },
    });
    expect(patchRes.status()).toBe(200);
  });

  test.afterAll(async ({ request }) => {
    if (batchId) {
      await request.delete(`/api/batches/${batchId}`);
    }
  });

  test("email form renders and send button submits email with success notification", async ({
    page,
    request,
  }) => {
    // Navigate to batch detail page
    await page.goto(`/batches/${batchId}`, { waitUntil: "networkidle" });

    // Verify the "Send Email" button appears for our ready prospect
    const row = page.locator("tr", { hasText: "Email Test Roofing Co" });
    await expect(row.getByRole("button", { name: /Send Email/i })).toBeVisible();

    // Click "Send Email"
    await row.getByRole("button", { name: /Send Email/i }).click();

    // Dialog should appear
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Send Email/i }),
    ).toBeVisible();

    // Template selector should default to "coldOutreach"
    await expect(page.getByText("Cold Outreach")).toBeVisible();

    // Click the Send Email button inside the dialog
    await page.getByRole("dialog").getByRole("button", { name: /Send Email/i }).click();

    // Dialog should close and success notification should appear
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5000 });
    await expect(
      page.getByText(/Email sent to Email Test Roofing Co/i),
    ).toBeVisible();

    // Save screenshot
    await page.screenshot({
      path: ".agent/screenshots/TASK-101-1.png",
      fullPage: true,
    });

    // Verify the sent email record exists in GET /api/email/sent
    const sentRes = await request.get("/api/email/sent");
    expect(sentRes.status()).toBe(200);
    const sentEmails: Array<{
      businessName: string;
      mode: string;
      templateId: string;
    }> = await sentRes.json();
    const record = sentEmails.find(
      (e) => e.businessName === "Email Test Roofing Co",
    );
    expect(record).toBeDefined();
    expect(record?.templateId).toBe("coldOutreach");
    // status stored as 'sent' in DB
    expect(record?.mode).toBe("sent");
  });
});
