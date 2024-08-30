import type { Page } from "@playwright/test";
import type { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startFinanzielleAngabenAusgaben(
  page: Page,
  formular: ProzesskostenhilfeFormular,
) {
  // /finanzielle-angaben/eausgaben/ausgaben-frage
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("hasAusgaben", "no");
}
