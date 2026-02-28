import type { Page } from "@playwright/test";

/**
 * Page Object Model for the Edit page (/edit/[slug]).
 */
export class EditorPage {
  constructor(private readonly page: Page) {}

  async goto(slug: string) {
    await this.page.goto(`/edit/${slug}`, { waitUntil: "networkidle" });
  }

  /**
   * Returns the number of sections shown in the section list panel,
   * parsed from the "Sections (N)" heading text.
   */
  async getSectionCount(): Promise<number> {
    const text = await this.page
      .locator("p", { hasText: /^Sections \(/ })
      .innerText();
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Clicks the palette swatch button with the given title (palette name).
   */
  async selectPalette(name: string) {
    await this.page.getByTitle(name).click();
  }

  /**
   * Returns the inner text of the first h1 in the preview (main) area.
   */
  async getPreviewHeadline(): Promise<string> {
    return this.page.locator("main h1").first().innerText();
  }

  /**
   * Opens the content editor sheet for a section type and updates a scalar text field.
   * Closes the sheet afterward.
   *
   * @param sectionType - e.g. "hero"
   * @param fieldLabel  - e.g. "Headline"
   * @param value       - new value to fill in
   */
  async editSectionContent(
    sectionType: string,
    fieldLabel: string,
    value: string,
  ) {
    // Compute the human-readable section label ("hero" → "Hero")
    const humanLabel = sectionType
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    // Click the edit button in the "Edit Content" panel
    await this.page
      .locator('div:has(> p:text-is("Edit Content"))')
      .locator("button", { hasText: humanLabel })
      .click();

    // Wait for the Sheet/dialog to open
    const dialog = this.page.locator('[role="dialog"]');
    await dialog.waitFor({ state: "visible" });

    // Find the field row by its label <p> and fill the adjacent input
    const fieldRow = dialog
      .locator("p", { hasText: new RegExp(`^${fieldLabel}$`) })
      .locator("..");
    await fieldRow.locator("input").fill(value);

    // Close the sheet via Escape
    await this.page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
  }

  /**
   * Waits for the auto-save "Saved" indicator to become visible (up to 10s).
   */
  async waitForAutoSave() {
    await this.page
      .getByText("Saved")
      .waitFor({ state: "visible", timeout: 10_000 });
  }
}
