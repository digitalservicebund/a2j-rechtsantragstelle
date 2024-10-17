import { type Page, expect } from "@playwright/test";
import { CookieSettings } from "../../../pom/CookieSettings";
import type { FluggastrechteVorabcheck } from "../../../pom/FluggastrechteVorabcheck";
import { expectPageToBeAccessible } from "../../../util/expectPageToBeAccessible";

export async function startFluggastrechteVorabcheckAnnullierung(
  page: Page,
  vorabcheck: FluggastrechteVorabcheck,
) {
  vorabcheck.goto();
  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();

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
  await vorabcheck.fillRadioPage("ersatzflugLandenZweiStunden", "yes");

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

  // fluggastrechte/vorabcheck/fluggesellschaft
  await vorabcheck.fillAutoSuggestInputPage(
    "input-fluggesellschaft",
    "Lufthansa",
  );
  await vorabcheck.clickNext();

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
}
