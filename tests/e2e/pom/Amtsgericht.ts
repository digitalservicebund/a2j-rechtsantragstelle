import type { Page } from "@playwright/test";

export class Amtsgericht {
  readonly page: Page;
  readonly resultHeading: string;

  constructor(page: Page) {
    this.page = page;
    this.resultHeading = "Ihr zuständiges Amtsgericht";
  }

  async goto() {
    await this.page.goto("/beratungshilfe/zustaendiges-gericht/suche");
  }

  async fillSearchField(value: string) {
    await this.page.locator("input[name=postcode]").fill(value);
  }

  async submitSearchForm() {
    await this.page
      .getByRole("button", { name: "Übernehmen & Weiter" })
      .click();
  }
}
