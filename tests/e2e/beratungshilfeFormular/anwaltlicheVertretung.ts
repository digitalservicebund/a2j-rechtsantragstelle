import { type Page } from "@playwright/test";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";

export async function startAnwaltlicheVertretung(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/anwaltlicheVertretung/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("anwaltskanzlei", "yes");

  // beratungshilfe/antrag/anwaltlicheVertretung/beratungStattgefunden
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("beratungStattgefunden", "yes");

  // beratungshilfe/antrag/anwaltlicheVertretung/beratungStattgefundenDatum
  await expectPageToBeAccessible({ page });
  const current = new Date(Date.now());
  const dateFormat = current.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  await beratungshilfeFormular.fillInputPage(
    "beratungStattgefundenDatum",
    dateFormat,
  );

  // beratungshilfe/antrag/anwaltlicheVertretung/frist-hinweis
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/anwaltlicheVertretung/anwaltKontaktdaten
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput(
    "anwaltName",
    "Leonardo Da Musterfrau",
  );
  await beratungshilfeFormular.fillInput(
    "anwaltStrasseUndHausnummer",
    "Berlinadestraße 123",
  );
  await beratungshilfeFormular.fillInput("anwaltPlz", "12345");
  await beratungshilfeFormular.fillInput("anwaltOrt", "Chemnitz");
  await beratungshilfeFormular.clickNext();
}
