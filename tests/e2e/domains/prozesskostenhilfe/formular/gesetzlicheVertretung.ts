import { type Page } from "@playwright/test";
import type { Formular } from "tests/e2e/domains/shared/Formular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startGesetzlicheVertretung(
  page: Page,
  formular: Formular,
) {
  // prozesskostenhilfe/formular/gesetzliche-vertretung/frage
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("hasGesetzlicheVertretung", "no");
}
