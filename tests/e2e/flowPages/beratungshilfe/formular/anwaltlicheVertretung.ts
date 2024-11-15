import { type Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";

export async function startAnwaltlicheVertretung(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/anwaltliche-vertretung/start
  await beratungshilfeFormular.fillRadioPage("anwaltskanzlei", "no");
}
