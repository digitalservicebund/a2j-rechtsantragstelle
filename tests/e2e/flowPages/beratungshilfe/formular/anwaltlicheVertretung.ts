import { type Page } from "@playwright/test";
import { today, toGermanDateFormat } from "~/util/date";
import type { BeratungshilfeFormular } from "../../../pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "../../../util/expectPageToBeAccessible";

export async function startAnwaltlicheVertretung(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/anwaltliche-vertretung/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("anwaltskanzlei", "yes");

  // beratungshilfe/antrag/anwaltliche-vertretung/beratung-stattgefunden
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("beratungStattgefunden", "yes");

  // beratungshilfe/antrag/anwaltliche-vertretung/beratung-stattgefunden-datum
  await expectPageToBeAccessible({ page });

  await beratungshilfeFormular.fillInputPage(
    "beratungStattgefundenDatum",
    toGermanDateFormat(today()),
  );

  // beratungshilfe/antrag/anwaltliche-vertretung/frist-hinweis
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/anwaltliche-vertretung/anwalt-kontaktdaten
  await expectPageToBeAccessible({ page });
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
