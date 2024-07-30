import { test, expect } from "@playwright/test";
import { startFluggastrechteVorabcheckAnnullierung } from "./vorabcheckAnnullierung";
import { startFluggastrechteVorabcheckFunnelCheck } from "./vorabcheckFunnelCheck";
import { startFluggastrechteVorabcheckNichtBefoerderung } from "./vorabcheckNichtBefoerderung";
import { startFluggastrechteVorabcheckVerspaetung } from "./vorabcheckVerspaetung";
import { CookieSettings } from "../pom/CookieSettings";
import { FluggastrechteVorabcheck } from "../pom/FluggastrechteVorabcheck";

let vorabcheck: FluggastrechteVorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new FluggastrechteVorabcheck(page);
  await vorabcheck.goto();
});

test.describe("js enabled", () => {
  test.beforeEach(async ({ page }) => {
    const cookieSettings = new CookieSettings(page);
    await cookieSettings.acceptCookieBanner();
  });

  test("forwarded to intial step", async ({ page }) => {
    await expect(page).toHaveURL(
      new RegExp(`.+${vorabcheck.url}/${vorabcheck.initialStep}$`),
    );
  });

  test("fluggastrechte vorabcheck: Verspaetung can be traversed", async ({
    page,
  }) => {
    startFluggastrechteVorabcheckVerspaetung(page, vorabcheck);
  });

  test("fluggastrechte vorabcheck: Nicht-Befoerderung can be traversed", async ({
    page,
  }) => {
    startFluggastrechteVorabcheckNichtBefoerderung(page, vorabcheck);
  });

  test("fluggastrechte vorabcheck: Annullierung can be traversed", async ({
    page,
  }) => {
    startFluggastrechteVorabcheckAnnullierung(page, vorabcheck);
  });

  test("funnel: funnel check", async ({ page }) => {
    startFluggastrechteVorabcheckFunnelCheck(page, vorabcheck);
  });
});

test.describe("js disabled", () => {
  test.use({ javaScriptEnabled: false });
  test("fluggastrechte vorabcheck can be traversed", () => {
    test.describe("js disabled", () => {
      test.use({ javaScriptEnabled: false });

      test("fluggastrechte vorabcheck can be traversed", async ({ page }) => {
        await page.getByRole("button").filter({ hasText: "Ablehnen" }).click();
        await vorabcheck.goto();
        await vorabcheck.clickNextWithoutJavaScript();

        // fluggastrechte/vorabcheck/bereich
        await vorabcheck.fillRadioPageNonJavascript("bereich", "verspaetet");

        // fluggastrechte/vorabcheck/verspaetung
        await vorabcheck.fillRadioPageNonJavascript("verspaetung", "yes");

        // fluggastrechte/vorabcheck/gruende
        await vorabcheck.fillRadioPageNonJavascript("gruende", "no");

        // fluggastrechte/vorabcheck/verjaehrung
        await vorabcheck.fillRadioPageNonJavascript("verjaehrung", "yes");

        // fluggastrechte/vorabcheck/flughaefen
        await vorabcheck.fillMultipleInputPageNonJavascript([
          { field: "startAirport", value: "BER" },
          { field: "endAirport", value: "FRA" },
        ]);

        // fluggastrechte/vorabcheck/fluggesellschaft
        await vorabcheck.fillInputPageNonJavascript("fluggesellschaft", "LH");

        // fluggastrechte/vorabcheck/checkin
        await vorabcheck.fillRadioPageNonJavascript("checkin", "yes");

        // fluggastrechte/vorabcheck/kostenlos
        await vorabcheck.fillRadioPageNonJavascript("kostenlos", "no");

        // fluggastrechte/vorabcheck/rabatt
        await vorabcheck.fillRadioPageNonJavascript("rabatt", "no");

        // fluggastrechte/vorabcheck/buchung
        await vorabcheck.fillRadioPageNonJavascript("buchung", "yes");

        // fluggastrechte/vorabcheck/abtretung
        await vorabcheck.fillRadioPageNonJavascript("abtretung", "no");

        // fluggastrechte/vorabcheck/entschaedigung
        await vorabcheck.fillRadioPageNonJavascript("entschaedigung", "yes");

        // fluggastrechte/vorabcheck/gericht
        await vorabcheck.fillRadioPageNonJavascript("gericht", "no");

        // fluggastrechte/vorabcheck/ergebnis/erfolg
        await expect(page).toHaveURL(
          new RegExp(`.+${vorabcheck.url}/ergebnis/erfolg$`),
        );
      });
    });
  });
});
