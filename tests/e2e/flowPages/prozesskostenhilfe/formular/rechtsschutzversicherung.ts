import type { Page } from "@playwright/test";
import type { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";

export async function startRechtsschutzversicherung(
  page: Page,
  formular: ProzesskostenhilfeFormular,
) {
  await formular.fillRadioPage("hasRsv", "no");
  await formular.fillRadioPage("hasRsvThroughOrg", "no");
}
