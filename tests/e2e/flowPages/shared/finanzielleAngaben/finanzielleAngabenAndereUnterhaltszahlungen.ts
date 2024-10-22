import type { Page } from "@playwright/test";
import type { Formular } from "tests/e2e/pom/Formular";

export async function startFinanzielleAngabenAndereUnterhaltszahlungen(
  page: Page,
  formular: Formular,
) {
  // /finanzielle-angaben/andere-unterhaltszahlungen/frage
  await formular.fillRadioPage("hasWeitereUnterhaltszahlungen", "no");
}
