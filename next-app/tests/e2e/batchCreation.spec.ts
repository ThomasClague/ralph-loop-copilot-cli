import { expect, test } from "@playwright/test";
import { NewBatchPage } from "./pages/NewBatchPage";
import { BatchDetailPage } from "./pages/BatchDetailPage";

const CSV_DATA = `business_name,industry,location
Alpha Roofing,roofing,London
Beta Roofing,roofing,Manchester
Gamma Roofing,roofing,Birmingham`;

test.describe("Batch creation flow", () => {
  test("creates a batch via CSV import and shows prospects in batch detail", async ({
    page,
  }) => {
    const newBatchPage = new NewBatchPage(page);
    const batchDetailPage = new BatchDetailPage(page);

    // Navigate to new batch page
    await newBatchPage.goto();
    await expect(page).toHaveURL("/batches/new");

    // Enter batch name
    await newBatchPage.setBatchName("Test Roofing Batch");

    // Paste 3-row CSV data
    await newBatchPage.pasteCSV(CSV_DATA);

    // Click parse
    await newBatchPage.clickParse();

    // Verify 3 rows appear in the preview table
    const rowCount = await newBatchPage.getPreviewRowCount();
    expect(rowCount).toBe(3);

    // Submit the batch
    await newBatchPage.submit();

    // Verify redirect to batch detail page
    await page.waitForURL(/\/batches\/[^/]+$/, { timeout: 10000 });
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/batches\/[^/]+$/);

    // Extract batch id from URL path
    const batchId = currentUrl.match(/\/batches\/([^/?#]+)/)?.[1];
    expect(batchId).toBeTruthy();

    // Verify 3 prospects appear in the batch detail table
    const prospectCount = await batchDetailPage.getProspectCount();
    expect(prospectCount).toBe(3);

    // Verify a specific business name is shown
    await expect(page.getByText("Alpha Roofing")).toBeVisible();

    // Verify Generate All Pending button is available
    await expect(
      page.getByRole("button", { name: /Generate All Pending/i }),
    ).toBeVisible();

    // Save screenshot for task verification
    await page.screenshot({
      path: ".agent/screenshots/TASK-98-1.png",
      fullPage: true,
    });
  });
});
