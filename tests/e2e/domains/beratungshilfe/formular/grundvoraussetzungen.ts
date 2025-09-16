import { type Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "tests/e2e/domains/beratungshilfe/formular/BeratungshilfeFormular";

export async function startGrundvoraussetzungen(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/grundvoraussetzungen/rechtsschutzversicherung
  await beratungshilfeFormular.fillRadioPage("rechtsschutzversicherung", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/wurde-verklagt
  await beratungshilfeFormular.fillRadioPage("wurdeVerklagt", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/klage-eingereicht
  await beratungshilfeFormular.fillRadioPage("klageEingereicht", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/hamburg-oder-bremen
  await beratungshilfeFormular.fillRadioPage("hamburgOderBremen", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/beratungshilfe-beantragt
  await beratungshilfeFormular.fillRadioPage("beratungshilfeBeantragt", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/eigeninitiative-grundvorraussetzung
  await beratungshilfeFormular.fillRadioPage(
    "eigeninitiativeGrundvorraussetzung",
    "no",
  );
}
