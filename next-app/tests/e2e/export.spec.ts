import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { expect, test } from "@playwright/test";
import JSZip from "jszip";

/**
 * E2E test for the site export flow.
 * Creates a ready prospect, navigates to the edit page,
 * triggers an "Export as ZIP" download, and verifies the ZIP contents.
 */
test.describe("Export flow", () => {
  // Run tests serially so beforeAll executes once and generation happens only once
  test.describe.configure({ mode: "serial", timeout: 180_000 });

  let batchId: string;
  let slug: string;

  test.beforeAll(async ({ request }) => {
    test.setTimeout(180_000); // Allow enough time for AI generation (~60s)
    // 1. Create a batch
    const batchRes = await request.post("/api/batches", {
      data: { name: "Export E2E Test Batch", industry: "roofing" },
    });
    expect(batchRes.status()).toBe(201);
    const batch = await batchRes.json();
    batchId = batch.id;

    // 2. Create a prospect
    const prospectRes = await request.post("/api/prospects", {
      data: {
        batchId,
        prospects: [
          {
            businessName: "Export Test Roofing Co",
            industry: "roofing",
            location: "Austin, TX",
            existingUrl: "https://example.com",
          },
        ],
      },
    });
    expect(prospectRes.status()).toBe(201);
    const prospectsData = await prospectRes.json();
    slug = prospectsData[0].slug;

    // 3. Trigger generation
    const genRes = await request.post(`/api/generate/prospect/${slug}`, {
      data: {},
    });
    expect(genRes.status()).toBe(202);

    // 4. Poll until the prospect reaches "ready" status (up to 150s)
    const deadline = Date.now() + 150_000;
    let status = "";
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 3000));
      const res = await request.get(`/api/batches/${batchId}/prospects`);
      const data = await res.json();
      const p = (data as Array<{ businessName: string; status: string }>).find(
        (x) => x.businessName === "Export Test Roofing Co",
      );
      status = p?.status ?? "";
      if (status === "ready" || status === "failed") break;
    }
    expect(status).toBe("ready");

    expect(slug).toBeTruthy();
  });

  test.afterAll(async ({ request }) => {
    if (batchId) {
      await request.delete(`/api/batches/${batchId}`);
    }
  });

  test("export button is visible in editor", async ({ page }) => {
    await page.goto(`/edit/${slug}`, { waitUntil: "networkidle" });

    const exportBtn = page.getByTestId("export-button");
    await expect(exportBtn).toBeVisible();

    await page.screenshot({
      path: ".agent/screenshots/TASK-102-1.png",
      fullPage: true,
    });
  });

  test("clicking Export as ZIP triggers a ZIP download containing index.html", async ({
    page,
  }) => {
    test.setTimeout(60_000);

    await page.goto(`/edit/${slug}`, { waitUntil: "networkidle" });

    // Open the Export dropdown
    const exportBtn = page.getByTestId("export-button");
    await expect(exportBtn).toBeVisible();
    await exportBtn.click();

    // Wait for the "Export as ZIP" menu item and set up download listener
    const exportZipItem = page.getByTestId("export-zip-item");
    await expect(exportZipItem).toBeVisible();

    // Listen for the download event triggered by window.location.href redirect
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30_000 }),
      exportZipItem.click(),
    ]);

    // Assert download filename ends with .zip
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toMatch(/\.zip$/);

    // Save to a temp path and verify contents
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "export-e2e-"));
    const zipPath = path.join(tmpDir, suggestedFilename);
    await download.saveAs(zipPath);

    // Verify the ZIP is valid and contains index.html with size > 1000 bytes
    const zipBuffer = fs.readFileSync(zipPath);
    const zip = await JSZip.loadAsync(zipBuffer);

    const indexFile = zip.file("index.html");
    expect(indexFile).not.toBeNull();

    const indexContent = await indexFile!.async("string");
    expect(indexContent.length).toBeGreaterThan(1000);

    // Clean up temp dir
    fs.rmSync(tmpDir, { recursive: true, force: true });

    await page.screenshot({
      path: ".agent/screenshots/TASK-102-2.png",
      fullPage: true,
    });
  });
});
