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
  await formular.fillInputPage("geburtsdatum", "01.01.1934");

  // prozesskostenhilfe/formular/persoenliche-daten/adresse
  await formular.fillInput("strasseHausnummer", "Entenhausenstraße 123");
  await formular.fillInput("plz", "10115");
  await formular.fillInput("ort", "Entenhausen");
  await formular.clickNext();

  // prozesskostenhilfe/formular/persoenliche-daten/telefonnummer
  await formular.fillInputPage("telefonnummer", "123456789");

  // prozesskostenhilfe/formular/persoenliche-daten/telefonnummer
  await formular.fillInputPage("beruf", "developer");
}
