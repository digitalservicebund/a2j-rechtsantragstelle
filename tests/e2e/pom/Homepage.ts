import type { Page, Locator } from "@playwright/test";

export class Homepage {
  readonly page: Page;
  readonly links: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.links = {
      kitchensink: page.getByRole("link", { name: "kitchensink" }),
      multiPageForm: page.getByRole("link", { name: "multi-page form" }),
      typesShowcase: page.getByRole("link", { name: "types showcase" }),
    };
  }

  async goto() {
    await this.page.goto("http://localhost:3000");
  }

  async gotoKitchensink() {
    await this.links.kitchensink.click();
  }

  async gotoMultiPageForm() {
    await this.links.multiPageForm.click();
  }

  async gotoTypesShowcase() {
    await this.links.typesShowcase.click();
  }
}
