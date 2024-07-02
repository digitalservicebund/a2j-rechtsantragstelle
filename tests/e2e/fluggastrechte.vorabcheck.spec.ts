import { test, expect } from "@playwright/test";
import { CookieSettings } from "./pom/CookieSettings";
import { FluggastrechteVorabcheck } from "./pom/FluggastrechteVorabcheck";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";

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

  test("fluggastrechte vorabcheck can be traversed", async ({ page }) => {
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
    await vorabcheck.fillMultipleAutoSuggestInputPage([
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

  test("fluggastrechte vorabcheck: Nicht-Befoerderung can be traversed", async ({
    page,
  }) => {
    // fluggastrechte/vorabcheck/start
    await vorabcheck.clickNext();

    // fluggastrechte/vorabcheck/bereich
    await vorabcheck.fillRadioPage("bereich", "nichtbefoerderung");

    // fluggastrechte/vorabcheck/ausgleich
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("ausgleich", "yes");

    // fluggastrechte/vorabcheck/ausgleich-angenommen
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("ausgleichAngenommen", "no");

    // fluggastrechte/vorabcheck/checkin-nicht-befoerderung
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("checkin", "yes");

    // fluggastrechte/vorabcheck/vertretbare-gruende
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("vertretbareGruende", "no");

    // fluggastrechte/vorabcheck/verjaehrung
    await vorabcheck.fillRadioPage("verjaehrung", "yes");

    // fluggastrechte/vorabcheck/flughaefen
    await vorabcheck.fillMultipleAutoSuggestInputPage([
      { field: "input-startAirport", value: "Berlin" },
      { field: "input-endAirport", value: "Frankfurt" },
    ]);

    // fluggastrechte/vorabcheck/kostenlos
    await vorabcheck.fillRadioPage("kostenlos", "no");

    // fluggastrechte/vorabcheck/rabatt
    await vorabcheck.fillRadioPage("rabatt", "no");

    // fluggastrechte/vorabcheck/buchung
    await vorabcheck.fillRadioPage("buchung", "yes");

    // fluggastrechte/vorabcheck/abtretung
    await vorabcheck.fillRadioPage("abtretung", "no");

    // fluggastrechte/vorabcheck/entschaedigung
    await vorabcheck.fillRadioPage("entschaedigung", "yes");

    // fluggastrechte/vorabcheck/gericht
    await vorabcheck.fillRadioPage("gericht", "no");

    // fluggastrechte/vorabcheck/ergebnis/erfolg
    await expect(page).toHaveURL(
      new RegExp(`.+${vorabcheck.url}/ergebnis/erfolg$`),
    );
  });

  test("fluggastrechte vorabcheck: Annullierung can be traversed", async ({
    page,
  }) => {
    // fluggastrechte/vorabcheck/start
    await vorabcheck.clickNext();

    // fluggastrechte/vorabcheck/bereich
    await vorabcheck.fillRadioPage("bereich", "annullierung");

    //fluggastrechte/vorabcheck/ankuendigung
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("ankuendigung", "until6Days");

    //fluggastrechte/vorabcheck/ersatzflug
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("ersatzflug", "yes");

    //fluggastrechte/vorabcheck/ersatzflug-starten-eine-stunde
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("ersatzflugStartenEinStunde", "yes");

    //fluggastrechte/vorabcheck/ersatzflug-landen-zwei-stunden
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("ersatzflugLandenZweiStuden", "yes");

    //fluggastrechte/vorabcheck/vertretbare-gruende-annullierung
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("vertretbareGruendeAnnullierung", "yes");

    //fluggastrechte/vorabcheck/gruende-hinweis
    await vorabcheck.clickNext();

    // fluggastrechte/vorabcheck/verjaehrung
    await expectPageToBeAccessible({ page });
    await vorabcheck.fillRadioPage("verjaehrung", "yes");

    // fluggastrechte/vorabcheck/flughaefen
    await vorabcheck.fillMultipleAutoSuggestInputPage([
      { field: "input-startAirport", value: "Berlin" },
      { field: "input-endAirport", value: "Frankfurt" },
    ]);

    // fluggastrechte/vorabcheck/kostenlos
    await vorabcheck.fillRadioPage("kostenlos", "no");

    // fluggastrechte/vorabcheck/rabatt
    await vorabcheck.fillRadioPage("rabatt", "no");

    // fluggastrechte/vorabcheck/buchung
    await vorabcheck.fillRadioPage("buchung", "yes");

    // fluggastrechte/vorabcheck/abtretung
    await vorabcheck.fillRadioPage("abtretung", "no");

    // fluggastrechte/vorabcheck/entschaedigung
    await vorabcheck.fillRadioPage("entschaedigung", "yes");

    // fluggastrechte/vorabcheck/gericht
    await vorabcheck.fillRadioPage("gericht", "no");

    // fluggastrechte/vorabcheck/ergebnis/erfolg
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
