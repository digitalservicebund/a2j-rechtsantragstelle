import type { Page } from "@playwright/test";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";

export async function startFinanzielleAngabenEigentum(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielleAngaben/eigentum/eigentum-info
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/eigentum/heirat-info
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/eigentum/bankkonten-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasBankkonto", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/eigentum/geldanlagen-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasGeldanlage", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/eigentum/wertsachen-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasWertsache", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/eigentum/grundeigentum-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasGrundeigentum", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/eigentum/kraftfahrzeuge-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasKraftfahrzeug", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/eigentum/gesamtwert
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("besitzTotalWorth", "more10000");
}
