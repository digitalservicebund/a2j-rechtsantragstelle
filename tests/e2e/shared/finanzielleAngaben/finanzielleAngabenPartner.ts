import type { Page } from "@playwright/test";
import { Formular } from "tests/e2e/pom/Formular";
import { expectPageToBeAccessible } from "../../util/expectPageToBeAccessible";

export async function startFinanzielleAngabenPartner(
  page: Page,
  formular: Formular,
) {
  // /finanzielle-angaben/partner/partnerschaft
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("partnerschaft", "yes");

  // /finanzielle-angaben/partner/zusammenleben
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("zusammenleben", "no");

  // /finanzielle-angaben/partner/unterhalt
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("unterhalt", "yes");

  // /finanzielle-angaben/partner/unterhalts-summe
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("unterhaltsSumme", "100");

  // /finanzielle-angaben/partner/partner-name
  await expectPageToBeAccessible({ page });
  await formular.fillInput("partnerVorname", "Dagobert");
  await formular.fillInput("partnerNachname", "Duck");
  await formular.clickNext();
}
