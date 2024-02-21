import { Formular } from "tests/e2e/pom/Formular";

export class BeratungshilfeFormular extends Formular {
  readonly url = "/beratungshilfe/antrag";
  readonly initialStep = "start";

  async hasAntragDownloadButton() {
    return await this.page.locator("#Download Button").isVisible();
  }
}
