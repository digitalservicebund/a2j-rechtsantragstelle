import { test, expect } from "@playwright/test";
import { startFluggastrechteVorabcheckAnnullierung } from "./vorabcheckAnnullierung";
import { startFluggastrechteVorabcheckFunnelCheck } from "./vorabcheckFunnelCheck";
import { startFluggastrechteVorabcheckNichtBefoerderung } from "./vorabcheckNichtBefoerderung";
import { startFluggastrechteVorabcheckVerspaetung } from "./vorabcheckVerspaetung";
import { startFluggastrechteVorabcheckVerspaetungNoJS } from "./vorabcheckVerspaetungNoJS";
import { FluggastrechteVorabcheck } from "../pom/FluggastrechteVorabcheck";

let vorabcheck: FluggastrechteVorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new FluggastrechteVorabcheck(page);
  await vorabcheck.goto();
});

test.describe("js enabled", () => {
  test("forwarded to intial step", async ({ page }) => {
    await expect(page).toHaveURL(
      new RegExp(`.+${vorabcheck.url}/${vorabcheck.initialStep}$`),
    );
  });

  test("fluggastrechte vorabcheck: Verspaetung can be traversed", async ({
    page,
  }) => {
    await startFluggastrechteVorabcheckVerspaetung(page, vorabcheck);
  });

  test("fluggastrechte vorabcheck: Nicht-Befoerderung can be traversed", async ({
    page,
  }) => {
    await startFluggastrechteVorabcheckNichtBefoerderung(page, vorabcheck);
  });

  test("fluggastrechte vorabcheck: Annullierung can be traversed", async ({
    page,
  }) => {
    await startFluggastrechteVorabcheckAnnullierung(page, vorabcheck);
  });

  test("funnel: funnel check", async ({ page }) => {
    await startFluggastrechteVorabcheckFunnelCheck(page, vorabcheck);
  });
});

test.describe("js disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("fluggastrechte vorabcheck: Verspätung can be traversed", async ({
    page,
  }) => {
    await startFluggastrechteVorabcheckVerspaetungNoJS(page, vorabcheck);
  });
});
