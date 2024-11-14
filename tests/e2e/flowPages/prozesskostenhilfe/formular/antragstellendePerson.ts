import type { Page } from "@playwright/test";
import type { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";

export async function startAntragstellendePerson(
  page: Page,
  formular: ProzesskostenhilfeFormular,
) {
  // /prozesskostenhilfe/formular/antragstellende-person/empfaenger
  await formular.fillRadioPage("empfaenger", "ich");

  // /prozesskostenhilfe/formular/antragstellende-person/unterhaltsanspruch
  await formular.fillRadioPage("unterhaltsanspruch", "keine");
}
