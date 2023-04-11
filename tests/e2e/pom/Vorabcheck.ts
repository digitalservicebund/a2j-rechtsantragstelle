import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class Vorabcheck {
  readonly page: Page;
  readonly url = "/vorabcheck";
  readonly initialStep = "rechtsschutzversicherung";
  readonly nextButtonText = "Übernehmen & Weiter";
  readonly timeout = 500;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async expectHeading(count = 2) {
    expect(await this.page.getByRole("heading").count()).toBeGreaterThanOrEqual(
      count
    );
  }

  async select(field: string, option: string) {
    // We have to click the label because the input is covered by the before element
    // The label text itself is unknown due to using a cms
    await this.page.locator(`label[for=${field}-${option}]`).click();
  }

  async clickNext() {
    await Promise.all([
      this.page
        .getByRole("button", { name: this.nextButtonText })
        .click({ timeout: this.timeout }),
      this.page.waitForNavigation(), // deprecated but URL for waitForURL is unknown
    ]);
  }

  async fillRadioPage(field: string, option: string) {
    await this.expectHeading();
    await this.select(field, option);
    await this.clickNext();
  }

  async fillInputPage(field: string, value: string) {
    await this.expectHeading();
    await this.page.locator(`input[name=${field}]`).fill(value);
    await this.clickNext();
  }
}
