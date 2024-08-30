import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startFinanzielleAngabenEinkommen(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielle-angaben/einkommen/start
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielle-angaben/einkommen/staatliche-leistungen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("staatlicheLeistungen", "keine");

  // beratungshilfe/antrag/finanzielle-angaben/einkommen/erwerbstaetig
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("erwerbstaetig", "yes");

  // beratungshilfe/antrag/finanzielle-angaben/einkommen/art
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillCheckboxesPage(
    "berufart.selbststaendig",
    "berufart.festangestellt",
  );

  // beratungshilfe/antrag/finanzielle-angaben/einkommen/situation
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("berufsituation", "student");

  // beratungshilfe/antrag/finanzielle-angaben/einkommen/weiteres-einkommen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillCheckboxesPage(
    "weitereseinkommen.unterhaltszahlungen",
    "weitereseinkommen.wohngeld",
  );

  // beratungshilfe/antrag/finanzielle-angaben/einkommen/weiteres-einkommen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("einkommen", "100");
}
