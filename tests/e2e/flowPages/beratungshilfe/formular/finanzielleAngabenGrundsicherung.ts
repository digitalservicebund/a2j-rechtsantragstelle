import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";

export async function startFinanzielleAngabenGrundsicherung(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielle-angaben/einkommen/start
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielle-angaben/einkommen/staatliche-leistungen
  await beratungshilfeFormular.fillRadioPage(
    "staatlicheLeistungen",
    "grundsicherung",
  );
}
