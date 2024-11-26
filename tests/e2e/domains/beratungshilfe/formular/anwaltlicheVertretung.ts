import type { BeratungshilfeFormular } from "tests/e2e/domains/beratungshilfe/formular/BeratungshilfeFormular";

export async function startAnwaltlicheVertretung(
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/anwaltliche-vertretung/start
  await beratungshilfeFormular.fillRadioPage("anwaltskanzlei", "no");
}
