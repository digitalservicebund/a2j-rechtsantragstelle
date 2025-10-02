import { type Page } from "@playwright/test";
import type { Formular } from "tests/e2e/domains/shared/Formular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startPersoenlicheDaten(page: Page, formular: Formular) {
  // prozesskostenhilfe/formular/persoenliche-daten/start
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // prozesskostenhilfe/formular/persoenliche-daten/name
  await formular.fillInput("vorname", "Donald");
  await formular.fillInput("nachname", "Duck");
  await formular.clickNext();

  // prozesskostenhilfe/formular/persoenliche-daten/geburtsdatum
  await formular.fillInput("geburtsdatum.tag", "01");
  await formular.fillInput("geburtsdatum.monat", "01");
  await formular.fillInput("geburtsdatum.jahr", "1970");
  await formular.clickNext();

  // prozesskostenhilfe/formular/persoenliche-daten/postleitzahl
  await formular.fillInputPage("plz", "20457");

  // prozesskostenhilfe/formular/persoenliche-daten/adresse
  await formular.fillInput("houseNumber", "123");
  await formular.fillInput("ort", "Entenhausen");
  await formular.fillAutoSuggestInputPage("input-street", "Am Elbtunnel");
  await formular.clickNext();

  // prozesskostenhilfe/formular/persoenliche-daten/telefonnummer
  await formular.fillInputPage("telefonnummer", "123456789");

  // prozesskostenhilfe/formular/persoenliche-daten/telefonnummer
  await formular.fillInputPage("beruf", "developer");
}
