import { expect } from "@playwright/test";
import { Formular } from "tests/e2e/pom/Formular";

export class BeratungshilfeFormular extends Formular {
  readonly url = "/beratungshilfe/antrag";
  readonly initialStep = "start/start";
  readonly downloadButtonLocator = '[href="/beratungshilfe/antrag/pdf"]';

  async hasAntragDownloadButton() {
    await expect(this.page.locator(this.downloadButtonLocator)).toBeVisible();
  }

  async pressAntragDownloadButton() {
    const [resp] = await Promise.all([
      this.page.waitForResponse((resp) =>
        resp.url().includes("/beratungshilfe/antrag/pdf"),
      ),
      this.page.locator(this.downloadButtonLocator).click(),
    ]);
    expect(resp.status()).toEqual(200);
  }
}
