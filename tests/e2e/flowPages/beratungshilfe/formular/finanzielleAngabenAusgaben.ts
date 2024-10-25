import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";

export async function startFinanzielleAngabenAusgaben(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielle-angaben/ausgaben/ausgaben-frage
  await beratungshilfeFormular.fillRadioPage("hasAusgaben", "no");
}
