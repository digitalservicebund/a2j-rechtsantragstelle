import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startFinanzielleAngabenAusgaben(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielle-angaben/ausgaben/ausgaben-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasAusgaben", "no");
}
