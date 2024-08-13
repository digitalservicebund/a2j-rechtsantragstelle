import type { Page } from "@playwright/test";
import { Formular } from "tests/e2e/pom/Formular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startFinanzielleAngabenAndereUnterhaltszahlungen(
  page: Page,
  formular: Formular,
) {
  // /finanzielle-angaben/andere-unterhaltszahlungen/frage
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("hasWeitereUnterhaltszahlungen", "no");
}
