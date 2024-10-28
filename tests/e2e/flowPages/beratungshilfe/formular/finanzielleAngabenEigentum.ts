import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";

export async function startFinanzielleAngabenEigentum(
  page: Page,
  formular: BeratungshilfeFormular,
) {
  // /finanzielle-angaben/eigentum/eigentum-info
  await formular.clickNext();

  // /finanzielle-angaben/eigentum/heirat-info
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

  // /finanzielle-angaben/eigentum/gesamtwert
  await formular.fillRadioPage("eigentumTotalWorth", "more10000");
}
