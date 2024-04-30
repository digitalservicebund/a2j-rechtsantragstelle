import { test, expect } from "@playwright/test";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";
import { FluggastrechteVorabcheck } from "./pom/FluggastrechteVorabcheck";

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

  test("fluggastrechte vorabcheck can be traversed and Javascript enabled", async ({
    page,
  }) => {
    // fluggastrechte/vorabcheck/start
    await expectPageToBeAccessible({ page });
    await vorabcheck.clickNext();

    // fluggastrechte/vorabcheck/bereich
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("bereich", "verspaetet");

    // fluggastrechte/vorabcheck/verspaetung
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("verspaetung", "yes");

    // fluggastrechte/vorabcheck/gruende
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("gruende", "no");

    // fluggastrechte/vorabcheck/verjaehrung
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("verjaehrung", "yes");

    // fluggastrechte/vorabcheck/flughaefen
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillMultipleSuggestionInputPage([
      { field: "input-startAirport", value: "Berlin" },
      { field: "input-endAirport", value: "Frankfurt" },
    ]);

    // fluggastrechte/vorabcheck/checkin
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("checkin", "yes");

    // fluggastrechte/vorabcheck/kostenlos
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("kostenlos", "no");

    // fluggastrechte/vorabcheck/rabatt
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("rabatt", "no");

    // fluggastrechte/vorabcheck/buchung
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("buchung", "yes");

    // fluggastrechte/vorabcheck/abtretung
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("abtretung", "no");

    // fluggastrechte/vorabcheck/entschaedigung
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("entschaedigung", "yes");

    // fluggastrechte/vorabcheck/gericht
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("gericht", "no");

    // fluggastrechte/vorabcheck/ergebnis/erfolg
    await expectPageToBeAccessible({ page });
    await expect(page).toHaveURL(
      new RegExp(`.+${vorabcheck.url}/ergebnis/erfolg$`),
    );
  });

  test("funnel: invalid step redirects to start", async ({ page }) => {
    await page.goto(`${vorabcheck.url}/stepDoesNotExist`);
    await expect(page).toHaveURL(
      new RegExp(`.+${vorabcheck.url}/${vorabcheck.initialStep}$`),
    );
  });

  test("funnel: disabled step redirects to start", async ({ page }) => {
    await page.goto(`${vorabcheck.url}/buchung`);
    await expect(page).toHaveURL(
      new RegExp(`.+${vorabcheck.url}/${vorabcheck.initialStep}$`),
    );
  });
});

test.describe("js disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("fluggastrechte vorabcheck can be traversed and Javascript disabled", async ({
    page,
  }) => {
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
