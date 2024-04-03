import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

export async function startFinanzielleAngabenAusgaben(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielleAngaben/ausgaben/ausgaben-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasAusgaben", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/ausgaben/situation
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillCheckboxes(
    "ausgabensituation.pregnancy",
    "ausgabensituation.singleParent",
  );

  // beratungshilfe/antrag/finanzielleAngaben/kinder/uebersicht
  await expectPageToBeAccessible({ page });
  await page.getByTestId("add-ausgaben").click();

  // beratungshilfe/antrag/finanzielleAngaben/ausgaben/ausgaben/0/art
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput("ausgaben#art", "Kredit");
  await beratungshilfeFormular.fillInput(
    "ausgaben#zahlungsempfaenger",
    "Musterian",
  );
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/ausgaben/ausgaben/0/zahlungsinformation
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("ausgaben#beitrag", "10");

  // beratungshilfe/antrag/finanzielleAngaben/ausgaben/ausgaben/0/laufzeit
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage(
    "ausgaben#hasZahlungsfrist",
    "yes",
  );

  // beratungshilfe/antrag/finanzielleAngaben/ausgaben/ausgaben/0/zahlungsfrist
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage(
    "ausgaben#zahlungsfrist",
    "10.10.2100",
  );

  // beratungshilfe/antrag/finanzielleAngaben/kinder/uebersicht
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();
}
