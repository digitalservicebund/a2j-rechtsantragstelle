import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

export async function startFinanzielleAngabenPartner(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielleAngaben/partner/partnerschaft
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("partnerschaft", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/partner/zusammenleben
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("zusammenleben", "no");

  // beratungshilfe/antrag/finanzielleAngaben/partner/unterhalt
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("unterhalt", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/partner/unterhalts-summe
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("unterhaltsSumme", "100");

  // beratungshilfe/antrag/finanzielleAngaben/partner/partner-name
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput("partnerVorname", "Dagobert");
  await beratungshilfeFormular.fillInput("partnerNachname", "Duck");
  await beratungshilfeFormular.clickNext();
}
