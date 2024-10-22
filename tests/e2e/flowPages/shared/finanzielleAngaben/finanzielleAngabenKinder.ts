import type { Page } from "@playwright/test";
import type { Formular } from "tests/e2e/pom/Formular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startFinanzielleAngabenKinder(
  page: Page,
  formular: Formular,
) {
  // /finanzielle-angaben/kinder/kinder-frage
  await formular.fillRadioPage("hasKinder", "yes");

  // /finanzielle-angaben/kinder/uebersicht
  await expectPageToBeAccessible({ page });
  await formular.clickAnchorByText("Kind hinzufügen");

  // /finanzielle-angaben/kinder/kinder/0/name
  await formular.fillInput("kinder#vorname", "Clara");
  await formular.fillInput("kinder#nachname", "Musterian");
  await formular.fillInput("kinder#geburtsdatum", "12.12.2020");
  await formular.clickNext();

  // /finanzielle-angaben/kinder/kinder/0/wohnort
  await formular.fillRadioPage("kinder#wohnortBeiAntragsteller", "yes");

  // /finanzielle-angaben/kinder/kinder/0/kind-eigene-einnahmen-frage
  await formular.fillRadioPage("kinder#eigeneEinnahmen", "yes");

  // /finanzielle-angaben/kinder/kinder/0/kind-eigene-einnahmen
  await formular.fillInputPage("kinder#einnahmen", "5");

  // /finanzielle-angaben/kinder/uebersicht
  await formular.clickNext();
}
