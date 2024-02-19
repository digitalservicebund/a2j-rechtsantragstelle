import { type Page, expect, test } from "@playwright/test";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";
import { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";

let beratungshilfeFormular: BeratungshilfeFormular;

test.beforeEach(async ({ page }) => {
  beratungshilfeFormular = new BeratungshilfeFormular(page);
  await beratungshilfeFormular.goto();
});

test("forwarded to initial step", async ({ page }) => {
  await expect(page).toHaveURL(
    new RegExp(
      `.+${beratungshilfeFormular.url}/${beratungshilfeFormular.initialStep}$`,
    ),
  );
});

test("beratungshilfe formular can be traversed", async ({ page }) => {
  // beratunshilfe/antrag/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  await startGrundvoraussetzungen(page);
  await startAnwaltlicheVertretung(page);
  await startRechtsproblem(page);

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/staatliche-leistungen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("staatlicheLeistungen", "keine");

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/erwerbstaetig
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("erwerbstaetig", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/art
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillCheckboxPage(
    "berufart.selbststaendig",
    "berufart.festangestellt",
  );

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/situation
});

async function startRechtsproblem(page: Page) {
  // beratungshilfe/antrag/rechtsproblem/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/rechtsproblem/bereich
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("bereich", "authorities");

  // beratungshilfe/antrag/rechtsproblem/beschreibung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage(
    "beschreibung",
    "Ich habe ein Problem mit der Verwaltung",
  );

  // beratungshilfe/antrag/rechtsproblem/eigeninitiative
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("eigeninitiative", "yes");

  // beratungshilfe/antrag/rechtsproblem/eigeninitiativeBeschreibung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage(
    "eigeninitiativeBeschreibung",
    "Ich habe das Problem gelöst",
  );

  // beratungshilfe/antrag/rechtsproblem/sonstiges
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage(
    "sonstiges",
    "Ich habe das Problem gelöst",
  );

  // beratungshilfe/antrag/rechtsproblem/danke
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();
}

async function startAnwaltlicheVertretung(page: Page) {
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

  console.log(dateFormat);
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

// test("funnel: invalid step redirects to start", async ({ page }) => {
//   await page.goto(`${fluggastrechte.url}/stepDoesNotExist`);
//   await expect(page).toHaveURL(
//     new RegExp(`.+${fluggastrechte.url}/${fluggastrechte.initialStep}$`),
//   );
// });

// test("funnel: last enabled step can be accessed directly", async ({ page }) => {
//   await page.goto(`${fluggastrechte.url}/versand/einverstaendnis`);
//   await expect(page).toHaveURL(
//     new RegExp(`.+${fluggastrechte.url}/versand/einverstaendnis$`),
//   );
// });

async function startGrundvoraussetzungen(page: Page) {
  // beratungshilfe/antrag/grundvoraussetzungen/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/grundvoraussetzungen/rechtsschutzversicherung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("rechtsschutzversicherung", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/wurdeVerklagt
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("wurdeVerklagt", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/klageEingereicht
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("klageEingereicht", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/beratungshilfeBeantragt
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("beratungshilfeBeantragt", "no");

  // beratungshilfe/antrag/grundvoraussetzungen/eigeninitiativeGrundvorraussetzung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage(
    "eigeninitiativeGrundvorraussetzung",
    "no",
  );
}
