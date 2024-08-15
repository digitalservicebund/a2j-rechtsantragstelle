import { Page, expect } from "@playwright/test";
import { CookieSettings } from "../../../pom/CookieSettings";
import type { FluggastrechteVorabcheck } from "../../../pom/FluggastrechteVorabcheck";
import { expectPageToBeAccessible } from "../../../util/expectPageToBeAccessible";

export async function startFluggastrechteVorabcheckVerspaetung(
  page: Page,
  vorabcheck: FluggastrechteVorabcheck,
) {
  vorabcheck.goto();
  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();

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

  // fluggastrechte/vorabcheck/fluggesellschaft
  await expectPageToBeAccessible({ page });
  await vorabcheck.fillAutoSuggestInputPage(
    "input-fluggesellschaft",
    "Lufthansa",
  );
  await vorabcheck.clickNext();

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
}
