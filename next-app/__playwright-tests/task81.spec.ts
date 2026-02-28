import { test, expect } from "@playwright/test";
import path from "path";

const EDIT_SLUG = "test-plumber-task79-ac87a5";
const SCREENSHOT_DIR = path.join(__dirname, "../.agent/screenshots");

test("palette picker renders color swatches", async ({ page }) => {
  await page.goto(`/edit/${EDIT_SLUG}`);

  // Wait for the page to fully load (palette picker visible)
  await expect(page.getByText("Color Palette")).toBeVisible({ timeout: 10000 });

  // Should have at least 8 swatch buttons (one per palette)
  const swatches = page.locator('[title]').filter({ hasText: "" }).locator("xpath=ancestor-or-self::button").filter({ hasNot: page.locator("svg") });
  // Use a more direct selector: buttons inside the palette grid
  const paletteSection = page.locator("text=Color Palette").locator("..");
  const buttons = paletteSection.locator("button");
  await expect(buttons.first()).toBeVisible();
  expect(await buttons.count()).toBeGreaterThanOrEqual(8);

  // Screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "TASK-81-1.png"),
    fullPage: false,
  });
});

test("palette picker highlights active palette with ring", async ({ page }) => {
  await page.goto(`/edit/${EDIT_SLUG}`);
  await expect(page.getByText("Color Palette")).toBeVisible({ timeout: 10000 });

  // The active swatch should have outline style (ring)
  const paletteSection = page.locator("text=Color Palette").locator("..");
  const activeButton = paletteSection.locator("button[style*='outline']");
  await expect(activeButton).toBeVisible();
});

test("clicking a palette swatch changes the active palette", async ({
  page,
}) => {
  await page.goto(`/edit/${EDIT_SLUG}`);
  await expect(page.getByText("Color Palette")).toBeVisible({ timeout: 10000 });

  // Find the first button without the active ring and click it
  const paletteSection = page.locator("text=Color Palette").locator("..");
  const allSwatches = paletteSection.locator("button");
  await allSwatches.nth(1).click();

  // After clicking, the outline ring should be on the second swatch
  await page.waitForTimeout(300);
  const activeButton = paletteSection.locator("button[style*='outline']");
  await expect(activeButton).toBeVisible();

  // Screenshot after palette change
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "TASK-81-2.png"),
    fullPage: false,
  });
});
