import { expect, test } from "@playwright/test";
import type { SiteConfig } from "../src/types/site";

const siteConfig: SiteConfig = {
  slug: "e2e-preview-test",
  paletteId: "ocean-blue",
  businessInfo: {
    name: "Apex Plumbing",
    phone: "555-123-4567",
    email: "info@apexplumbing.com",
    location: "Austin, TX",
    industry: "plumbing",
  },
  sections: [
    {
      id: "hero-1",
      type: "hero",
      variant: "centered",
      visible: true,
      content: {
        headline: "Austin's Most Trusted Plumbers",
        subheadline: "Fast, reliable plumbing services available 24/7",
        ctaText: "Get a Free Quote",
        ctaHref: "#contact",
        imageUrl: "https://placehold.co/1200x600/png",
      },
    },
    {
      id: "contact-1",
      type: "contact",
      variant: "form",
      visible: true,
      content: {
        headline: "Contact Us",
        showForm: true,
      },
    },
  ],
};

test("preview page shows 404 for unknown slug", async ({ page }) => {
  const res = await page.goto("/preview/no-such-prospect-xyz123");
  expect(res?.status()).toBe(404);
});

test("preview page renders site content for ready prospect", async ({
  page,
}) => {
  // Create batch
  const batchRes = await page.request.post("/api/batches", {
    data: { name: "Preview E2E Batch", industry: "plumbing" },
  });
  expect(batchRes.status()).toBe(201);
  const batch = await batchRes.json();

  // Create prospect
  const prospectRes = await page.request.post("/api/prospects", {
    data: {
      batchId: batch.id,
      prospects: [
        {
          businessName: "Apex Plumbing",
          industry: "plumbing",
          location: "Austin, TX",
          slug: "e2e-preview-test",
        },
      ],
    },
  });
  expect(prospectRes.status()).toBe(201);
  const [prospect] = await prospectRes.json();

  // Patch prospect to ready with siteConfig
  const patchRes = await page.request.patch(`/api/prospects/${prospect.slug}`, {
    data: { status: "ready", siteConfig },
  });
  expect(patchRes.status()).toBe(200);

  // Navigate to preview page
  await page.goto(`/preview/${prospect.slug}`, { waitUntil: "networkidle" });

  // Top bar should show business name
  await expect(page.getByText("Apex Plumbing")).toBeVisible();

  // Edit and Export buttons should be visible
  await expect(page.getByRole("link", { name: /Edit/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Export/i })).toBeVisible();

  // Hero section headline should render
  await expect(
    page.getByText("Austin's Most Trusted Plumbers"),
  ).toBeVisible();

  // Screenshot
  await page.screenshot({
    path: ".agent/screenshots/TASK-78-1.png",
    fullPage: true,
  });
});
