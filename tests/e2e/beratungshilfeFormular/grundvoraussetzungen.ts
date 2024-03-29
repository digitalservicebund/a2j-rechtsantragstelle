import { type Page } from "@playwright/test";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";

export async function startGrundvoraussetzungen(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/grundvoraussetzungen/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/grundvoraussetzungen/rechtsschutzversicherung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("rechtsschutzversicherung", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/wurdeVerklagt
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("wurdeVerklagt", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/klageEingereicht
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("klageEingereicht", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/beratungshilfeBeantragt
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("beratungshilfeBeantragt", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/eigeninitiativeGrundvorraussetzung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage(
    "eigeninitiativeGrundvorraussetzung",
    "no",
  );
}
