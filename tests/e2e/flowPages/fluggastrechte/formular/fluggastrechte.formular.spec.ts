import { test } from "@playwright/test";
import { FluggastrechteFormular } from "tests/e2e/pom/FluggastrechteFormular";
import { FluggastrechteVorabcheck } from "tests/e2e/pom/FluggastrechteVorabcheck";
import { startFluggastrechteFormular } from "./startFluggastrechteFormular";
import { startFluggastrechteVorabcheckVerspaetung } from "../vorabcheck/vorabcheckVerspaetung";

let vorabcheck: FluggastrechteVorabcheck;
let formular: FluggastrechteFormular;

test.beforeEach(async ({ page }) => {
  vorabcheck = new FluggastrechteVorabcheck(page);
  formular = new FluggastrechteFormular(page);
});

test.describe("Fluggastrechte Formular", () => {
  test.skip("fluggastrechte from Vorabcheck to Klage Formular", async ({
    page,
  }) => {
    await startFluggastrechteVorabcheckVerspaetung(page, vorabcheck);
    await startFluggastrechteFormular(page, formular);
  });

  test("redirect to vorabcheck when goes to /fluggastrechte/formular/grundvorraussetzungen/redirect-vorabcheck", async ({
    page,
  }) => {
    const redirectPromise = page.waitForResponse(
      (resp) => resp.url().includes("/fluggastrechte") && resp.status() === 200,
    );

    await page.goto(
      `${formular.url}/grundvorraussetzungen/redirect-vorabcheck`,
    );
    await redirectPromise;
  });
});
