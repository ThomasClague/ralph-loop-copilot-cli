import { test, expect } from "@playwright/test";
import path from "path";

test("AboutLeft and AboutRight smoke test", async ({ page }) => {
  await page.goto("http://localhost:3000/test-about");

  // Verify about-left renders with image on left
  const aboutLeft = page.locator("#about-left");
  await expect(aboutLeft).toBeVisible();
  await expect(aboutLeft.locator("img")).toBeVisible();
  await expect(aboutLeft.locator("h2").last()).toContainText("About Smith Plumbing");

  // Verify stat chips are rendered
  const chips = aboutLeft.locator('[style*="--color-primary"]');
  await expect(chips.first()).toBeVisible();

  // Verify about-right renders
  const aboutRight = page.locator("#about-right");
  await expect(aboutRight).toBeVisible();
  await expect(aboutRight.locator("img")).toBeVisible();

  // Verify placeholder renders when no image
  const aboutNoImage = page.locator("#about-no-image");
  await expect(aboutNoImage).toBeVisible();
  await expect(aboutNoImage.locator("img")).not.toBeVisible();

  await page.screenshot({
    path: path.join(process.cwd(), "../.agent/screenshots/TASK-19-1.png"),
    fullPage: true,
  });
});
