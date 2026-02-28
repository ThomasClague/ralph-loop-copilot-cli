import { test, expect } from "@playwright/test";

const EDIT_SLUG = "test-plumber-task79-ac87a5";

test("section list panel renders rows with action buttons", async ({
  page,
}) => {
  await page.goto(`/edit/${EDIT_SLUG}`);

  // Wait for the sections panel to load
  const sectionsPanel = page.getByText("Sections (2)");
  await expect(sectionsPanel).toBeVisible({ timeout: 10000 });

  // Action buttons present (eye, refresh, trash) — at least 2 sets
  const eyeButtons = page.getByTitle("Hide section");
  await expect(eyeButtons.first()).toBeVisible({ timeout: 5000 });

  const refreshButtons = page.getByTitle("Regenerate section content");
  await expect(refreshButtons.first()).toBeVisible();

  const removeButtons = page.getByTitle("Remove section");
  await expect(removeButtons.first()).toBeVisible();

  // Drag handles present
  const gripIcons = page.locator('[title="Hide section"]');
  expect(await gripIcons.count()).toBeGreaterThanOrEqual(2);
});

test("section list panel toggle hides section", async ({ page }) => {
  await page.goto(`/edit/${EDIT_SLUG}`);
  await expect(page.getByText("Sections (2)")).toBeVisible({ timeout: 10000 });

  // Click eye button on Hero to hide it
  const heroHideBtn = page.getByTitle("Hide section").first();
  await heroHideBtn.click();

  // Button should now be "Show section"
  await expect(page.getByTitle("Show section").first()).toBeVisible();
});
