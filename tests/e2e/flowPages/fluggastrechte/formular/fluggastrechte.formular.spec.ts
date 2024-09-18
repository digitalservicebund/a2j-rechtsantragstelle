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

test.describe("happy path", () => {
  test.skip("fluggastrechte from Vorabcheck to Klage Formular", async ({
    page,
  }) => {
    await startFluggastrechteVorabcheckVerspaetung(page, vorabcheck);
    await startFluggastrechteFormular(page, formular);
  });
});
