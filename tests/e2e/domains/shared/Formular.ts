import type { Page } from "@playwright/test";

export class Formular {
  readonly page: Page;
  readonly url: string = "";
  readonly initialStep: string = "";
  readonly nextButtonName = "_action";

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async clickLabelFor(label: string) {
    await this.page.locator(`label[for="${label}"]`).click();
  }

  async clickAnchorByText(innerText: string) {
    await this.page.locator(`a:has-text("${innerText}")`).click();
  }

  async select(field: string, option: string) {
    // We have to click the label because the input is covered by the before element
    // The label text itself is unknown due to using a cms
    await this.clickLabelFor(`${field.split(".").join("\\.")}-${option}`);
  }

  async clickNext() {
    await this.page.locator(`button[name="${this.nextButtonName}"]`).click();
    /**
     * waitForNavigation() is 'deprecated' (not actually, just discouraged) for its inherent raciness.
     * However, as we don't know what the next page's url is going to be beforehand,
     * we can't drop-in the replacement waitForURL().
     *
     * see https://github.com/microsoft/playwright/issues/20853 for a discussion,
     */
    await this.page.waitForNavigation();
  }

  async fillRadioPage(field: string, option: string) {
    await this.select(field, option);
    await this.clickNext();
  }

  async fillCheckboxes(...checkboxNames: string[]) {
    for (const checkboxName of checkboxNames) {
      await this.page
        .locator(
          `input[type="checkbox"][name="${checkboxName.split(".").join("\\.")}"]`,
        )
        .click();
    }
  }

  async fillCheckboxesPage(...checkboxNames: string[]) {
    await this.fillCheckboxes(...checkboxNames);
    await this.clickNext();
  }

  async fillTextarea(field: string, value: string) {
    await this.page
      .locator(`textarea[name="${field.split(".").join("\\.")}"]`)
      .fill(value);
  }

  async fillTextareaPage(field: string, value: string) {
    await this.page
      .locator(`textarea[name="${field.split(".").join("\\.")}"]`)
      .fill(value);
    await this.clickNext();
  }

  async fillInput(field: string, value: string) {
    await this.page
      .locator(`input[name="${field.split(".").join("\\.")}"]`)
      .fill(value);
  }

  async fillInputPage(field: string, value: string) {
    await this.fillInput(field, value);
    await this.clickNext();
  }

  async fillDropdown(field: string, value: string) {
    await this.page
      .locator(`select[name="${field.split(".").join("\\.")}"]`)
      .selectOption(value);
  }

  async fillDropdownPage(field: string, value: string) {
    await this.fillDropdown(field, value);
    await this.clickNext();
  }

  async fillAutoSuggestInputPage(field: string, value: string) {
    await this.page.waitForSelector(`[data-testid=${field}-loaded]`);
    await this.page.locator(`input[id="${field}"]`).fill(value);
    const menuItem = this.page
      .getByTestId("auto-suggest-input-menu-item")
      .first();
    await menuItem.dispatchEvent("click");
  }
}
