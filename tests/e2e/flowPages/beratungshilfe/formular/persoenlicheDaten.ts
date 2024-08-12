import { type Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "../../../pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "../../../util/expectPageToBeAccessible";

export async function startPersoenlicheDaten(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/persoenliche-daten/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenliche-daten/name
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput("vorname", "Donald");
  await beratungshilfeFormular.fillInput("nachname", "Duck");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenliche-daten/geburtsdatum
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("geburtsdatum", "01.01.1934");

  // beratungshilfe/antrag/persoenliche-daten/adresse
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput(
    "strasseHausnummer",
    "Entenhausenstraße 123",
  );
  await beratungshilfeFormular.fillInput("plz", "10115");
  await beratungshilfeFormular.fillInput("ort", "Entenhausen");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenliche-daten/telefonnummer
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("telefonnummer", "123456789");
}
