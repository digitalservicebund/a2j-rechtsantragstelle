import { test } from "@playwright/test";
import { startFluggastrechteFormular } from "./formular";
import { startFluggastrechteFunnelCheck } from "./formularFunnelCheck";
import { startFluggastrechteVorabcheckVerspaetung } from "./vorabcheckVerspaetung";
import { FluggastrechteFormular } from "../pom/FluggastrechteFormular";
import { FluggastrechteVorabcheck } from "../pom/FluggastrechteVorabcheck";

let vorabcheck: FluggastrechteVorabcheck;
let formular: FluggastrechteFormular;

test.beforeEach(async ({ page }) => {
  vorabcheck = new FluggastrechteVorabcheck(page);
  formular = new FluggastrechteFormular(page);
});

test.describe("happy path", () => {
  test("fluggastrechte from Vorabcheck to Klage Formular", async ({ page }) => {
    await startFluggastrechteVorabcheckVerspaetung(page, vorabcheck);
    await startFluggastrechteFormular(page, formular);
    await startFluggastrechteFunnelCheck(page, formular);
  });
});
