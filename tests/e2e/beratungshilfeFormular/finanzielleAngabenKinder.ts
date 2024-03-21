import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

export async function startFinanzielleAngabenKinder(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielleAngaben/kinder/kinder-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasKinder", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/kinder/uebersicht
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickAnchorByText("Kind hinzufügen");

  // beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/0/name
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput("kinder#vorname", "Clara");
  await beratungshilfeFormular.fillInput("kinder#nachname", "Musterian");
  await beratungshilfeFormular.fillInput("kinder#geburtsdatum", "12.12.2020");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/0/wohnort
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage(
    "kinder#wohnortBeiAntragsteller",
    "yes",
  );

  // beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/0/kind-eigene-einnahmen-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("kinder#eigeneEinnahmen", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/0/kind-eigene-einnahmen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("kinder#einnahmen", "5");

  // beratungshilfe/antrag/finanzielleAngaben/kinder/uebersicht
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();
}
