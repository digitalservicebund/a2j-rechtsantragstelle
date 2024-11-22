import { type Page, expect } from "@playwright/test";
import type { FluggastrechteVorabcheck } from "../../../pom/FluggastrechteVorabcheck";

export async function startFluggastrechteVorabcheckVerspaetungNoJS(
  page: Page,
  vorabcheck: FluggastrechteVorabcheck,
) {
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
}
