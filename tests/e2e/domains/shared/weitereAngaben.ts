import { type Page } from "@playwright/test";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { type Formular } from "./Formular";

export async function startWeitereAngaben(page: Page, formular: Formular) {
  await expectPageToBeAccessible({ page });
  await formular.fillTextarea(
    "weitereAngaben",
    "Weitere Angaben zu meinem Anliegen",
  );
  await formular.clickNext();
}
