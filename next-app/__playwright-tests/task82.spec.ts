import { test, expect } from "@playwright/test";
import path from "path";

const EDIT_SLUG = "test-plumber-task79-ac87a5";
const SCREENSHOT_DIR = path.join(__dirname, "../.agent/screenshots");

test("content editor shows section edit buttons", async ({ page }) => {
  await page.goto(`/edit/${EDIT_SLUG}`);

  // Wait for page load
  await expect(page.getByText("Edit Content")).toBeVisible({ timeout: 10000 });

  // Should list section edit buttons
  const editSection = page.locator("text=Edit Content").locator("..");
  const sectionButtons = editSection.locator("button");
  await expect(sectionButtons.first()).toBeVisible();
  expect(await sectionButtons.count()).toBeGreaterThanOrEqual(1);

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "TASK-82-1.png"),
    fullPage: false,
  });
});

test("clicking a section button opens the drawer", async ({ page }) => {
  await page.goto(`/edit/${EDIT_SLUG}`);
  await expect(page.getByText("Edit Content")).toBeVisible({ timeout: 10000 });

  // Click the first section edit button
  const editSection = page.locator("text=Edit Content").locator("..");
  const firstButton = editSection.locator("button").first();
  const sectionName = await firstButton.textContent();
  await firstButton.click();

  // Drawer should appear with the section name in the title
  await expect(page.locator('[data-slot="sheet-content"]')).toBeVisible({
    timeout: 5000,
  });

  // There should be at least one input visible in the drawer
  const inputs = page.locator('[data-slot="sheet-content"] input, [data-slot="sheet-content"] textarea');
  await expect(inputs.first()).toBeVisible();

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "TASK-82-2.png"),
    fullPage: false,
  });

  // Clean up: close the drawer using the close button (has sr-only "Close" text)
  const closeBtn = page.locator('[data-slot="sheet-content"]').getByText("Close");
  await closeBtn.click();
  await expect(page.locator('[data-slot="sheet-content"]')).not.toBeVisible({
    timeout: 5000,
  });

  console.log("Opened drawer for section:", sectionName?.trim());
});

test("editing headline updates preview in real time", async ({ page }) => {
  await page.goto(`/edit/${EDIT_SLUG}`);
  await expect(page.getByText("Edit Content")).toBeVisible({ timeout: 10000 });

  // Find "Hero" section edit button and click it
  const heroBtn = page.locator("button", { hasText: "Hero" }).first();
  await heroBtn.click();

  const sheetContent = page.locator('[data-slot="sheet-content"]');
  await expect(sheetContent).toBeVisible({ timeout: 5000 });

  // Edit the first text input (headline)
  const headlineInput = sheetContent.locator('input[placeholder=""]').first().or(
    sheetContent.locator("input").first()
  );
  await headlineInput.clear();
  await headlineInput.fill("TASK-82 Test Headline");

  // Give time for preview to re-render
  await page.waitForTimeout(500);

  // Screenshot with drawer open showing edited field
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "TASK-82-3.png"),
    fullPage: false,
  });

  // The main content area should reflect the updated text
  const preview = page.locator("main");
  await expect(preview.getByText("TASK-82 Test Headline")).toBeVisible({
    timeout: 3000,
  });
});
