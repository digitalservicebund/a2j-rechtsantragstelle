import type { Page } from "@playwright/test";

export class Formular {
  readonly page: Page;
  readonly url: string = "";
  readonly initialStep: string = "";
  readonly nextButtonName = "_action";
  readonly timeout = 5000;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async clickLabelFor(label: string) {
    await this.page.locator(`label[for=${label}]`).click();
  }

  async select(field: string, option: string) {
    // We have to click the label because the input is covered by the before element
    // The label text itself is unknown due to using a cms
    await this.clickLabelFor(`${field.split(".").join("\\.")}-${option}`);
  }

  async clickNext() {
    await this.page
      .locator(`button[name=${this.nextButtonName}]`)
      .click({ timeout: this.timeout });
    await this.page.waitForNavigation(); // deprecated but URL for waitForURL is unknown
  }

  async fillRadioPage(field: string, option: string) {
    await this.select(field, option);
    await this.clickNext();
  }

  async fillTextareaPage(field: string, value: string) {
    await this.page
      .locator(`textarea[name=${field.split(".").join("\\.")}]`)
      .fill(value);
    await this.clickNext();
  }

  async fillInput(field: string, value: string) {
    await this.page
      .locator(`input[name=${field.split(".").join("\\.")}]`)
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
}
