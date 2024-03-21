import { type Page } from "@playwright/test";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";

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

  // beratungshilfe/antrag/rechtsproblem/beschreibung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillTextareaPage(
    "beschreibung",
    "Ich habe ein Problem mit der Verwaltung",
  );

  // beratungshilfe/antrag/rechtsproblem/eigeninitiative
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("eigeninitiative", "yes");

  // beratungshilfe/antrag/rechtsproblem/eigeninitiativeBeschreibung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillTextareaPage(
    "eigeninitiativeBeschreibung",
    "Ich habe das Problem berichtet",
  );

  // beratungshilfe/antrag/rechtsproblem/sonstiges
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillTextareaPage(
    "sonstiges",
    "Ich habe das Problem gelöst",
  );

  // beratungshilfe/antrag/rechtsproblem/danke
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();
}
