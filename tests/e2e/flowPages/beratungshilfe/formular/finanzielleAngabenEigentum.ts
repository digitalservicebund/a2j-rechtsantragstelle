import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "../../../pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "../../../util/expectPageToBeAccessible";

export async function startFinanzielleAngabenEigentum(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielle-angaben/eigentum/eigentum-info
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielle-angaben/eigentum/heirat-info
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasBankkonto", "yes");

  // beratungshilfe/antrag/finanzielle-angaben/eigentum/geldanlagen-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasGeldanlage", "yes");

  // beratungshilfe/antrag/finanzielle-angaben/eigentum/wertsachen-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasWertsache", "yes");

  // beratungshilfe/antrag/finanzielle-angaben/eigentum/grundeigentum-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasGrundeigentum", "yes");

  // beratungshilfe/antrag/finanzielle-angaben/eigentum/kraftfahrzeuge-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasKraftfahrzeug", "yes");

  // beratungshilfe/antrag/finanzielle-angaben/eigentum/gesamtwert
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("eigentumTotalWorth", "more10000");
}
