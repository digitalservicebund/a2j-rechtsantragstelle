import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

export async function startFinanzielleAngabenAndereUnterhaltszahlungen(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielleAngaben/andere-unterhaltszahlungen/frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage(
    "hasOtherMaintenancePayments",
    "no",
  );
}
