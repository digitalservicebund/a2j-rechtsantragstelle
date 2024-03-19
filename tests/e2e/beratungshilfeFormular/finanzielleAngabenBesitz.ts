import type { Page } from "@playwright/test";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";

export async function startFinanzielleAngabenBesitz(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielleAngaben/besitz/eigentum-info
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/besitz/heirat-info
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/besitz/bankkonten-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasBankkonto", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/geldanlagen-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasGeldanlage", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/wertsachen-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasWertsache", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/grundeigentum-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasGrundeigentum", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/kraftfahrzeuge-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasKraftfahrzeug", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/gesamtwert
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("besitzTotalWorth", "more10000");
}
