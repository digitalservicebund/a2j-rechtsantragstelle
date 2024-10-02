import type { Page } from "@playwright/test";
import type { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startGrundvoraussetzungen(
  page: Page,
  formular: ProzesskostenhilfeFormular,
) {
  // /prozesskostenhilfe/formular/grundvoraussetzungen/nachueberpruefung-frage
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("formularArt", "nachueberpruefung");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/nachueberpruefung/name-gericht
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /prozesskostenhilfe/formular/grundvoraussetzungen/nachueberpruefung/aktenzeichen
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /prozesskostenhilfe/formular/grundvoraussetzungen/einreichung/fall
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("versandArt", "digital");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/einreichung/mjp
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("shouldUseMJP", "yes");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/einreichung/hinweis-digital-einreichung
  await expectPageToBeAccessible({ page });
  await formular.clickNext();
}
