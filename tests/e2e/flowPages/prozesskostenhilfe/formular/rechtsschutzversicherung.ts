import type { Page } from "@playwright/test";
import type { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startRechtsschutzversicherung(
  page: Page,
  formular: ProzesskostenhilfeFormular,
) {
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("hasRsv", "no");

  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("hasRsvThroughOrg", "no");
}
