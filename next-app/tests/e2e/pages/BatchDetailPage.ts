import type { Page } from "@playwright/test";

/**
 * Page Object Model for the Batch Detail page (/batches/[id]).
 */
export class BatchDetailPage {
  constructor(private readonly page: Page) {}

  async goto(id: string) {
    await this.page.goto(`/batches/${id}`, { waitUntil: "networkidle" });
  }

  /** Returns total number of prospect rows in the table */
  async getProspectCount(): Promise<number> {
    await this.page.waitForSelector("table tbody tr", { timeout: 10000 });
    return this.page.locator("table tbody tr").count();
  }

  /** Returns the status badge text for a specific business name */
  async getProspectStatus(businessName: string): Promise<string> {
    const row = this.page.locator("tr", { hasText: businessName });
    const badge = row.locator('[data-slot="badge"]').first();
    return badge.innerText();
  }

  async clickGenerate() {
    await this.page
      .getByRole("button", { name: /Generate All Pending/i })
      .click();
  }
}
