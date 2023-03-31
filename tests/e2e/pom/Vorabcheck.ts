import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class Vorabcheck {
  readonly page: Page;
  readonly url = "http://localhost:3000/vorabcheck";
  readonly nextButtonText = "Übernehmen & Weiter";
  readonly timeout = 300;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async expectHeading() {
    await expect(this.page.getByRole("heading")).toBeVisible({
      timeout: this.timeout,
    });
  }

  async select(text: string) {
    await this.page.getByText(text).click({ timeout: this.timeout });
  }

  async clickNext() {
    await this.page
      .getByRole("button", { name: this.nextButtonText })
      .click({ timeout: this.timeout });
  }
}
