import type { ProzesskostenhilfeFormular } from "tests/e2e/domains/prozesskostenhilfe/formular/ProzesskostenhilfeFormular";

export async function startGrundvoraussetzungen(
  formular: ProzesskostenhilfeFormular,
) {
  // /prozesskostenhilfe/formular/grundvoraussetzungen/nachueberpruefung-frage
  await formular.fillRadioPage("formularArt", "nachueberpruefung");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/nachueberpruefung/name-gericht
  await formular.clickNext();

  // /prozesskostenhilfe/formular/grundvoraussetzungen/nachueberpruefung/aktenzeichen
  await formular.clickNext();

  // /prozesskostenhilfe/formular/grundvoraussetzungen/einreichung/fall
  await formular.fillRadioPage("versandArt", "digital");

  // /prozesskostenhilfe/formular/grundvoraussetzungen/einreichung/mjp
  await formular.clickNext();

  // /prozesskostenhilfe/formular/grundvoraussetzungen/einreichung/hinweis-digital-einreichung
  await formular.clickNext();
}
