import { test, expect } from "@playwright/test";

const EDIT_SLUG = "test-plumber-task79-ac87a5";

test("edit page renders split-pane layout with live preview", async ({
  page,
}) => {
  await page.goto(`/edit/${EDIT_SLUG}`);

  // Left panel visible with key controls
  await expect(
    page.getByText("Test Plumber TASK79").first(),
  ).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Palette")).toBeVisible();
  await expect(page.getByText("Amber Trade")).toBeVisible();
  await expect(page.getByText("Sections (2)")).toBeVisible();

  // Right panel shows live site content
  await expect(page.getByText("Austin's Best Plumbers")).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByText("Call Now")).toBeVisible();
});

test("edit page shows error state for unknown slug", async ({ page }) => {
  await page.goto("/edit/no-such-prospect-xyz");
  await expect(page.getByText("Prospect not found")).toBeVisible({
    timeout: 10000,
  });
});
