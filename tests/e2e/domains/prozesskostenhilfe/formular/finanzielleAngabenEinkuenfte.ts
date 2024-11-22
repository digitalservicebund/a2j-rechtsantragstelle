import type { Page } from "@playwright/test";
import type { Formular } from "tests/e2e/pom/Formular";

export async function startFinanzielleAngabenEinkuenfte(
  page: Page,
  formular: Formular,
) {
  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/start
  await formular.clickNext();
  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/staatliche-leistungen
  await formular.fillRadioPage("staatlicheLeistungen", "grundsicherung");
}
