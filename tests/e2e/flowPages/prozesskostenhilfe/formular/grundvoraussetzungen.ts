import type { Page } from "@playwright/test";
import type { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startGrundvoraussetzungen(
  page: Page,
  formular: ProzesskostenhilfeFormular,
) {
  // /prozesskostenhilfe/formular/grundvoraussetzungen/nachueberpruefung-frage
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("formularArt", "erstantrag");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/antrag/klageersteller
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("verfahrenArt", "verfahrenAnwalt");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/einreichung/fall
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("versandArt", "digital");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/einreichung/hinweis-digital-einreichung
  await expectPageToBeAccessible({ page });
  await formular.clickNext();
}
