import { test, expect } from "@playwright/test";
import path from "path";

test("GalleryGrid and GalleryMasonry smoke test", async ({ page }) => {
  await page.goto("http://localhost:3000/test-gallery");

  // Verify Gallery Grid section renders
  const gridSection = page.locator("section").first();
  await expect(gridSection).toBeVisible();

  // Verify images are rendered in the grid
  const gridImages = page.locator("section").first().locator("img");
  await expect(gridImages.first()).toBeVisible();
  expect(await gridImages.count()).toBeGreaterThan(0);

  // Verify Gallery Masonry section renders
  const masonrySection = page.locator("section").nth(1);
  await expect(masonrySection).toBeVisible();

  // Verify images rendered in masonry
  const masonryImages = masonrySection.locator("img");
  await expect(masonryImages.first()).toBeVisible();
  expect(await masonryImages.count()).toBeGreaterThan(0);

  await page.screenshot({
    path: path.join(process.cwd(), "../.agent/screenshots/TASK-24-1.png"),
    fullPage: true,
  });
});
