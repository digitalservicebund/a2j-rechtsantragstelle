import { type Page, expect } from "@playwright/test";
import { CookieSettings } from "../../../pom/CookieSettings";
import type { FluggastrechteVorabcheck } from "../../../pom/FluggastrechteVorabcheck";

export async function startFluggastrechteVorabcheckNichtBefoerderung(
  page: Page,
  vorabcheck: FluggastrechteVorabcheck,
) {
  await vorabcheck.goto();
  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();

  // fluggastrechte/vorabcheck/start
  await vorabcheck.clickNext();

  // fluggastrechte/vorabcheck/bereich
  await vorabcheck.fillRadioPage("bereich", "nichtbefoerderung");

  // fluggastrechte/vorabcheck/ausgleich
  await vorabcheck.fillRadioPage("ausgleich", "yes");

  // fluggastrechte/vorabcheck/ausgleich-angenommen
  await vorabcheck.fillRadioPage("ausgleichAngenommen", "no");

  // fluggastrechte/vorabcheck/checkin-nicht-befoerderung
  await vorabcheck.fillRadioPage("checkin", "yes");

  // fluggastrechte/vorabcheck/vertretbare-gruende
  await vorabcheck.fillRadioPage("vertretbareGruende", "no");

  // fluggastrechte/vorabcheck/verjaehrung
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
