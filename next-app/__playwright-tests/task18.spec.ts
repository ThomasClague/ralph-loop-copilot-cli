import { test } from "@playwright/test";
import path from "path";

test("ServicesGrid and ServicesList smoke test", async ({ page }) => {
  await page.goto("http://localhost:3000/test-services");
  await page.waitForSelector("#services-grid");
  await page.screenshot({ path: path.join(process.cwd(), "../.agent/screenshots/TASK-18-1.png"), fullPage: true });
  
  // Scroll to services-list section for second screenshot
  await page.locator("#services-list").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(process.cwd(), "../.agent/screenshots/TASK-18-2.png") });
});
