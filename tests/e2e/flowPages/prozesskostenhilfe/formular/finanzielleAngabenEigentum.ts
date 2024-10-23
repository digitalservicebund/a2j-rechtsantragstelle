import type { Page } from "@playwright/test";
import type { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startFinanzielleAngabenEigentum(
  page: Page,
  formular: ProzesskostenhilfeFormular,
) {
  // /finanzielle-angaben/eigentum/eigentum-info
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /finanzielle-angaben/eigentum/heirat-info
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /finanzielle-angaben/eigentum/bankkonten-frage
  await formular.fillRadioPage("hasBankkonto", "yes");

  // /finanzielle-angaben/eigentum/geldanlagen-frage
  await formular.fillRadioPage("hasGeldanlage", "yes");

  // /finanzielle-angaben/eigentum/wertsachen-frage
  await formular.fillRadioPage("hasWertsache", "yes");

  // /finanzielle-angaben/eigentum/grundeigentum-frage
  await formular.fillRadioPage("hasGrundeigentum", "yes");

  // /finanzielle-angaben/eigentum/kraftfahrzeuge-frage
  await formular.fillRadioPage("hasKraftfahrzeug", "yes");
}
