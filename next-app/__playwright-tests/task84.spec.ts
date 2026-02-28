import { test, expect } from "@playwright/test";
import path from "path";

const SLUG = "apex-plumbing-9797a0";
const SCREENSHOT_DIR = path.join(__dirname, "../.agent/screenshots");

test("ExportButton renders in edit page sidebar", async ({ page }) => {
  await page.goto(`/edit/${SLUG}`);

  // Wait for the editor to load
  await expect(page.getByTestId("export-button")).toBeVisible({
    timeout: 15000,
  });

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "TASK-84-1.png"),
    fullPage: false,
  });
});

test("ExportButton dropdown opens with Export as ZIP option", async ({
  page,
}) => {
  await page.goto(`/edit/${SLUG}`);

  await expect(page.getByTestId("export-button")).toBeVisible({
    timeout: 15000,
  });

  // Open dropdown
  await page.getByTestId("export-button").click();

  await expect(page.getByTestId("export-zip-item")).toBeVisible({
    timeout: 3000,
  });

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "TASK-84-2.png"),
    fullPage: false,
  });
});

test("Export as ZIP shows error toast on 501 response", async ({ page }) => {
  await page.goto(`/edit/${SLUG}`);

  await expect(page.getByTestId("export-button")).toBeVisible({
    timeout: 15000,
  });

  // Open dropdown and click Export as ZIP
  await page.getByTestId("export-button").click();
  await page.getByTestId("export-zip-item").click();

  // Should show an error toast (since export engine is not yet implemented)
  await expect(page.getByTestId("export-toast")).toBeVisible({ timeout: 5000 });

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "TASK-84-3.png"),
    fullPage: false,
  });
});
