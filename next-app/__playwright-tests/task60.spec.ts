import { expect, test } from "@playwright/test";
import path from "path";
import fs from "fs";
import os from "os";

test("media upload area shows and validates filenames on new batch page", async ({
  page,
}) => {
  await page.goto("/batches/new");

  // Media Library collapsible should be visible
  const trigger = page.getByRole("button", { name: /Media Library/i });
  await expect(trigger).toBeVisible();

  // Expand it
  await trigger.click();

  // Dropzone should now be visible
  await expect(page.getByText("Drag & drop images here")).toBeVisible();
  await page.waitForTimeout(500); // wait for collapsible animation

  // Filename convention hint should be visible
  await expect(page.getByText(/Name files as/)).toBeVisible();

  // Upload a valid file via file input
  const validName = "hero-roofing-tiles.jpg";
  const tmpDir = os.tmpdir();
  const validPath = path.join(tmpDir, validName);
  fs.writeFileSync(validPath, Buffer.from("fake-image-data"));

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(validPath);

  // The file list item should appear (scroll into view)
  const fileItem = page.locator("li").filter({ hasText: validName });
  await expect(fileItem).toHaveCount(1, { timeout: 10000 });
  await fileItem.scrollIntoViewIfNeeded();
  await expect(fileItem).toBeVisible();

  // Should show slot badge "hero" and industry badge "roofing"
  await expect(fileItem.getByText("hero", { exact: true })).toBeVisible();
  await expect(fileItem.getByText("roofing", { exact: true })).toBeVisible();

  // Upload an invalid file
  const invalidName = "badname.jpg";
  const invalidPath = path.join(tmpDir, invalidName);
  fs.writeFileSync(invalidPath, Buffer.from("fake-image-data"));

  await fileInput.setInputFiles(invalidPath);
  const invalidItem = page.locator("li").filter({ hasText: invalidName });
  await expect(invalidItem).toHaveCount(1, { timeout: 10000 });
  await invalidItem.scrollIntoViewIfNeeded();
  await expect(invalidItem.getByText(/Invalid filename/)).toBeVisible();

  // Clean up temp files
  fs.unlinkSync(validPath);
  fs.unlinkSync(invalidPath);
});
