import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

export async function startFinanzielleAngabenEinkommen(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielleAngaben/start
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/staatliche-leistungen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("staatlicheLeistungen", "keine");

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/erwerbstaetig
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("erwerbstaetig", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/art
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillCheckboxesPage(
    "berufart.selbststaendig",
    "berufart.festangestellt",
  );

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/situation
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("berufsituation", "student");

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/weiteres-einkommen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillCheckboxesPage(
    "weitereseinkommen.unterhaltszahlungen",
    "weitereseinkommen.wohngeld",
  );

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/weiteres-einkommen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("einkommen", "100");
}
