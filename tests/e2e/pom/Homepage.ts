import type { Page, Locator } from "@playwright/test";

export class Homepage {
  readonly page: Page;
  readonly links: Record<string, Locator>;
  readonly title = "A2J - Digitale RAST";

  constructor(page: Page) {
    this.page = page;
    this.links = {
      kitchensink: page.getByRole("link", { name: "Kitchensink" }),
      multiPageForm: page.getByRole("link", { name: "Vorabcheck" }),
      typesShowcase: page.getByRole("link", {
        name: "Form Validation Example",
      }),
    };
  }

  async goto() {
    await this.page.goto("/");
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
