import { test, expect } from "@playwright/test";
import path from "path";

test("ComparisonTable smoke test", async ({ page }) => {
  await page.goto("http://localhost:3000/test-comparison");

  // Verify section renders
  const section = page.locator("section");
  await expect(section).toBeVisible();

  // Verify headline is visible
  await expect(page.getByText("Why Choose Us vs The Competition?")).toBeVisible();

  // Verify first column header is highlighted (business name)
  await expect(page.getByRole("columnheader", { name: "ProPlumb Co." })).toBeVisible();

  // Verify checkmarks and crosses are present
  await expect(page.locator("td").filter({ hasText: "✓" }).first()).toBeVisible();
  await expect(page.locator("td").filter({ hasText: "✗" }).first()).toBeVisible();

  await page.screenshot({
    path: path.join(process.cwd(), "../.agent/screenshots/TASK-33-1.png"),
    fullPage: true,
  });
});
