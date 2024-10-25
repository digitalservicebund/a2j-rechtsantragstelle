import type { Page } from "@playwright/test";
import type { Formular } from "tests/e2e/pom/Formular";

export async function startFinanzielleAngabenWohnung(
  page: Page,
  formular: Formular,
) {
  // /finanzielle-angaben/wohnung/alleine-zusammen
  await formular.fillRadioPage("livingSituation", "alone");
  // /finanzielle-angaben/wohnung/groesse
  await formular.fillInputPage("apartmentSizeSqm", "71");
  // /finanzielle-angaben/wohnung/anzahl-zimmer
  await formular.fillInputPage("numberOfRooms", "3");
  // /finanzielle-angaben/wohnung/miete-eigenheim
  await formular.fillRadioPage("rentsApartment", "yes");
  // /formular/finanzielle-angaben/wohnung/miete-alleine
  await formular.fillInput("totalRent", "1100");
  // /finanzielle-angaben/wohnung/nebenkosten
  await formular.fillInput("utilitiesCost", "250");
}
