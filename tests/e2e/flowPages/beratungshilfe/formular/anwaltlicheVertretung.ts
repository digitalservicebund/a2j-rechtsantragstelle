import { type Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";
import { today, toGermanDateFormat } from "~/util/date";

export async function startAnwaltlicheVertretung(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/anwaltliche-vertretung/start
  await beratungshilfeFormular.fillRadioPage("anwaltskanzlei", "yes");

  // beratungshilfe/antrag/anwaltliche-vertretung/beratung-stattgefunden
  await beratungshilfeFormular.fillRadioPage("beratungStattgefunden", "yes");

  // beratungshilfe/antrag/anwaltliche-vertretung/beratung-stattgefunden-datum
  await beratungshilfeFormular.fillInputPage(
    "beratungStattgefundenDatum",
    toGermanDateFormat(today()),
  );

  // beratungshilfe/antrag/anwaltliche-vertretung/frist-hinweis
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/anwaltliche-vertretung/anwalt-kontaktdaten
  await beratungshilfeFormular.fillInput(
    "anwaltName",
    "Leonardo Da Musterfrau",
  );
  await beratungshilfeFormular.fillInput(
    "anwaltStrasseUndHausnummer",
    "Berlinadestraße 123",
  );
  await beratungshilfeFormular.fillInput("anwaltPlz", "10115");
  await beratungshilfeFormular.fillInput("anwaltOrt", "Chemnitz");
  await beratungshilfeFormular.clickNext();
}
