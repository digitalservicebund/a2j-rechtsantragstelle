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

  async select(text: string) {
    await this.page
      .getByText(text, { exact: true })
      .click({ timeout: this.timeout });
  }

  async clickNext() {
    await Promise.all([
      this.page
        .getByRole("button", { name: this.nextButtonText })
        .click({ timeout: this.timeout }),
      this.page.waitForNavigation(), // deprecated but URL for waitForURL is unknown
    ]);
  }
}
