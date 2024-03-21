import { type Page } from "@playwright/test";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";

export async function startPersoenlicheDaten(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/persoenlicheDaten/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenlicheDaten/name
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput("vorname", "Donald");
  await beratungshilfeFormular.fillInput("nachname", "Duck");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenlicheDaten/geburtsdatum
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("geburtsdatum", "01.01.1934");

  // beratungshilfe/antrag/persoenlicheDaten/adresse
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput(
    "strasseHausnummer",
    "Entenhausenstraße 123",
  );
  await beratungshilfeFormular.fillInput("plz", "12345");
  await beratungshilfeFormular.fillInput("ort", "Entenhausen");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenlicheDaten/telefonnummer
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("telefonnummer", "123456789");

  // beratungshilfe/antrag/persoenlicheDaten/danke
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();
}
