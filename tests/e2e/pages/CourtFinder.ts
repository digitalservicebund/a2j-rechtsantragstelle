import type { Page } from "@playwright/test";

export class CourtFinder {
  readonly page: Page;
  readonly baseURL: string = "/beratungshilfe/zustaendiges-gericht";
  readonly searchURL: string = `${this.baseURL}/suche`;
  readonly resultURL: string = `${this.baseURL}/ergebnis`;
  readonly selectiontURL: string = `${this.baseURL}/auswahl`;
  readonly singleResultPLZ = "13086";
  readonly multipleResultPLZ = "20457";
  readonly referrer = "beratungshilfe";

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.searchURL);
  }

  async gotoWithReferrer(baseURL: string) {
    const referer = `${baseURL}${this.referrer}`;
    await this.page.goto(`${this.searchURL}?returnToHere`, { referer });
  }

  async searchPLZSingleResult() {
    await this.fillSearchField(this.singleResultPLZ);
    await this.submitSearchForm();
    await this.page.waitForURL(`${this.resultURL}/${this.singleResultPLZ}`);
  }

  async searchPLZEdgeCases() {
    await this.fillSearchField(this.multipleResultPLZ);
    await this.submitSearchForm();
    await this.page.waitForURL(
      `${this.baseURL}/auswahl/${this.multipleResultPLZ}`,
    );
  }

  async searchPLZInvalid() {
    await this.fillSearchField("1234");
    await this.submitSearchForm();
  }

  async searchPLZNonExistant() {
    await this.fillSearchField("12345");
    await this.submitSearchForm();
  }

  async clickBackButton() {
    await this.page.getByText("Zurück").click();
  }

  async fillSearchField(value: string) {
    await this.page.locator('input[name="postcode"]').fill(value);
  }

  async submitSearchForm() {
    await this.page.getByRole("button", { name: "Weiter" }).click();
  }
}
