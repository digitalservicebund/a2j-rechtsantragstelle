import { type Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

export async function startRechtsproblem(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/rechtsproblem/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/rechtsproblem/bereich
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("bereich", "authorities");

  // beratungshilfe/antrag/rechtsproblem/situation-beschreibung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillTextarea("gegenseite", "Jobcenter");

  await beratungshilfeFormular.fillTextarea(
    "beschreibung",
    "Ich habe ein Problem mit der Jobcenter",
  );

  await beratungshilfeFormular.fillTextarea(
    "ziel",
    "Ich möchte, dass das Jobcenter mir sofort alle Kürzungen zurückzahlt",
  );

  await beratungshilfeFormular.fillTextarea(
    "eigeninitiativeBeschreibung",
    "Ich habe dem Jobcenter geschrieben, aber sie antworten nicht",
  );

  await beratungshilfeFormular.clickNext();
}
