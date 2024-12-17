import type { BeratungshilfeFormular } from "tests/e2e/domains/beratungshilfe/formular/BeratungshilfeFormular";

export async function startFinanzielleAngabenGrundsicherung(
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielle-angaben/einkommen/start
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielle-angaben/einkommen/staatliche-leistungen
  await beratungshilfeFormular.fillRadioPage(
    "staatlicheLeistungen",
    "grundsicherung",
  );
}
