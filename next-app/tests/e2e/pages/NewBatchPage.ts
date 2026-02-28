import type { Page } from "@playwright/test";

/**
 * Page Object Model for the New Batch creation page (/batches/new).
 */
export class NewBatchPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/batches/new", { waitUntil: "networkidle" });
  }

  async setBatchName(name: string) {
    await this.page.getByLabel("Batch Name").fill(name);
  }

  async setIndustry(industry: string) {
    const trigger = this.page.locator("#batch-industry");
    await trigger.click();
    await this.page.getByRole("option", { name: industry }).click();
  }

  async pasteCSV(data: string) {
    await this.page.getByLabel(/Paste CSV/i).fill(data);
  }

  async clickParse() {
    await this.page.getByRole("button", { name: /^Parse$/ }).click();
  }

  /** Returns the number of data rows in the parsed preview table */
  async getPreviewRowCount(): Promise<number> {
    // Wait for the preview table to appear
    await this.page.waitForSelector("text=/prospects? ready to import/i");
    const rows = this.page.locator("table tbody tr");
    return rows.count();
  }

  async submit() {
    await this.page.getByRole("button", { name: /Create Batch/ }).click();
  }

  /** Returns the current URL after navigation */
  getRedirectUrl(): string {
    return this.page.url();
  }
}
