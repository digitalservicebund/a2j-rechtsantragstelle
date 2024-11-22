import { type Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startPersoenlicheDaten(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/persoenliche-daten/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenliche-daten/name
  await beratungshilfeFormular.fillInput("vorname", "Donald");
  await beratungshilfeFormular.fillInput("nachname", "Duck");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenliche-daten/geburtsdatum
  await beratungshilfeFormular.fillInputPage("geburtsdatum", "01.01.1934");

  // beratungshilfe/antrag/persoenliche-daten/adresse
  await beratungshilfeFormular.fillInput(
    "strasseHausnummer",
    "Entenhausenstraße 123",
  );
  await beratungshilfeFormular.fillInput("plz", "10115");
  await beratungshilfeFormular.fillInput("ort", "Entenhausen");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenliche-daten/telefonnummer
  await beratungshilfeFormular.fillInputPage("telefonnummer", "123456789");
}
