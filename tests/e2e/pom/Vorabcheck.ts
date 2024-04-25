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

  async clickNext(javaScriptEnabled: boolean) {
    await this.page.locator(`button[name="${this.nextButtonName}"]`).click();
    if (javaScriptEnabled) {
      await this.page.waitForNavigation(); // deprecated but URL for waitForURL is unknown
    }
  }

  async fillRadioPage(field: string, option: string) {
    await this.select(field, option);
    await this.clickNext(true);
  }

  async fillInputPage(field: string, value: string) {
    await this.page.locator(`input[name="${field}"]`).fill(value);
    await this.clickNext(true);
  }

  async fillDropdownPage(field: string, value: string) {
    await this.page.locator(`select[name="${field}"]`).selectOption(value);
    await this.clickNext(true);
  }

  async fillRadioPageNonJavascript(field: string, option: string) {
    await this.select(field, option);
    await this.clickNext(false);
  }

  async fillInputPageNonJavascript(field: string, value: string) {
    await this.page.locator(`input[name="${field}"]`).fill(value);
    await this.clickNext(false);
  }

  async fillMultipleInputPageNonJavascript(
    fields: { field: string; value: string }[],
  ) {
    for (const { field, value } of fields) {
      await this.page.locator(`input[name="${field}"]`).fill(value);
    }
    await this.clickNext(false);
  }

  async fillDropdownPageNonJavascript(field: string, value: string) {
    await this.page.locator(`select[name="${field}"]`).selectOption(value);
    await this.clickNext(false);
  }

  async fillMultipleSuggestionInputPage(
    fields: { field: string; value: string }[],
  ) {
    for (const { field, value } of fields) {
      await this.page.locator(`input[id="${field}"]`).fill(value);
      const locators = await this.page
        .getByTestId("suggestion-input-menu-item")
        .all();
      await locators[0].click();
    }
    await this.clickNext(true);
  }
}
