import type { Page } from "@playwright/test";
import type { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";

export async function startGrundvoraussetzungen(
  page: Page,
  formular: ProzesskostenhilfeFormular,
) {
  // /prozesskostenhilfe/formular/grundvoraussetzungen/nachueberpruefung-frage
  await formular.fillRadioPage("formularArt", "erstantrag");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/antrag/klageersteller
  await formular.fillRadioPage("verfahrenArt", "verfahrenAnwalt");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/einreichung/fall
  await formular.fillRadioPage("versandArt", "digital");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/einreichung/hinweis-digital-einreichung
  await formular.clickNext();
}
