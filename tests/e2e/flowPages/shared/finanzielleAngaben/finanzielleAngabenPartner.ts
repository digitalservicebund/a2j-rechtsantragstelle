import type { Page } from "@playwright/test";
import type { Formular } from "tests/e2e/pom/Formular";

export async function startFinanzielleAngabenPartner(
  page: Page,
  formular: Formular,
) {
  // /finanzielle-angaben/partner/partnerschaft
  await formular.fillRadioPage("partnerschaft", "yes");

  // /finanzielle-angaben/partner/zusammenleben
  await formular.fillRadioPage("zusammenleben", "no");

  // /finanzielle-angaben/partner/unterhalt
  await formular.fillRadioPage("unterhalt", "yes");

  // /finanzielle-angaben/partner/unterhalts-summe
  await formular.fillInputPage("unterhaltsSumme", "100");

  // /finanzielle-angaben/partner/partner-name
  await formular.fillInput("partnerVorname", "Dagobert");
  await formular.fillInput("partnerNachname", "Duck");
  await formular.clickNext();
}
