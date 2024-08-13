import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class Vorabcheck {
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

  async assertInitialStep() {
    const firstStepRegex = new RegExp(`.+${this.url}/${this.initialStep}$`);
    await expect(this.page).toHaveURL(firstStepRegex);
  }

  async select(field: string, option: string) {
    // We have to click the label because the input is covered by the before element
    // The label text itself is unknown due to using a cms
    await this.page.locator(`label[for="${field}-${option}"]`).click();
  }

  async clickNext() {
    await this.page.locator(`button[name="${this.nextButtonName}"]`).click();
    await this.page.waitForLoadState("load");
    await this.page.waitForNavigation(); // deprecated but URL for waitForURL is unknown
  }

  async clickNextWithoutJavaScript() {
    await this.page.locator(`button[name="${this.nextButtonName}"]`).click();
  }

  async fillRadioPage(field: string, option: string) {
    await this.select(field, option);
    await this.clickNext();
  }

  async fillInputPage(field: string, value: string) {
    await this.page.locator(`input[name="${field}"]`).fill(value);
    await this.clickNext();
  }

  async fillDropdownPage(field: string, value: string) {
    await this.page.locator(`select[name="${field}"]`).selectOption(value);
    await this.clickNext();
  }

  async fillRadioPageNonJavascript(field: string, option: string) {
    await this.select(field, option);
    await this.clickNextWithoutJavaScript();
  }

  async fillInputPageNonJavascript(field: string, value: string) {
    await this.page.locator(`input[name="${field}"]`).fill(value);
    await this.clickNextWithoutJavaScript();
  }

  async fillMultipleInputPageNonJavascript(
    fields: { field: string; value: string }[],
  ) {
    for (const { field, value } of fields) {
      await this.page.locator(`input[name="${field}"]`).fill(value);
    }
    await this.clickNextWithoutJavaScript();
  }

  async fillDropdownPageNonJavascript(field: string, value: string) {
    await this.page.locator(`select[name="${field}"]`).selectOption(value);
    await this.clickNextWithoutJavaScript();
  }

  async fillAutoSuggestInputPage(field: string, value: string) {
    await this.page.waitForSelector(`[data-testid=${field}-loaded]`);
    await this.page.locator(`input[id="${field}"]`).fill(value);
    const menuItem = await this.page
      .getByTestId("auto-suggest-input-menu-item")
      .first();
    await menuItem.dispatchEvent("click");
  }

  async fillMultipleAutoSuggestInputPage(
    fields: { field: string; value: string }[],
  ) {
    for (const { field, value } of fields) {
      await this.fillAutoSuggestInputPage(field, value);
    }
    await this.clickNext();
  }
}
