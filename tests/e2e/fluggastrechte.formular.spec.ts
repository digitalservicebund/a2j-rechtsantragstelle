import { expect, test } from "@playwright/test";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";
import { FluggastrechteFormular } from "tests/e2e/pom/FluggastrechteFormular";

let fluggastrechte: FluggastrechteFormular;

test.beforeEach(async ({ page }) => {
  fluggastrechte = new FluggastrechteFormular(page);
  await fluggastrechte.goto();
});

test("forwarded to initial step", async ({ page }) => {
  await expect(page).toHaveURL(
    new RegExp(`.+${fluggastrechte.url}/${fluggastrechte.initialStep}$`),
  );
});

test("fluggastrechte formular can be traversed", async ({ page }) => {
  // /fluggastrechte/formular/start
  await expectPageToBeAccessible({ page });
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/dokumente
  await expectPageToBeAccessible({ page });
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/daten-uebernahme
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillRadioPage("doMigration", "yes");

  // /fluggastrechte/formular/zwischenstopps
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillRadioPage("zwischenstopps", "no");

  // /fluggastrechte/formular/flugdaten/flug-details-single-flugnummer
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillInputPage("singleFlugnummer", "EJ 1234");

  // /fluggastrechte/formular/flugdaten/flug-details-single-abflug
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillInput("singleAbflugDatum", "12.12.2022");
  await fluggastrechte.fillInput("singleAbflugZeit", "10:00");
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/flugdaten/flug-details-single-ankunft
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillInput("singleAnkunftDatum", "12.12.2022");
  await fluggastrechte.fillInput("singleAnkunftZeit", "10:00");
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/ankunft
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillRadioPage("ankunftWithSameFlight", "no");

  // /fluggastrechte/formular/ankunft-flugnummer
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillInputPage("ankunftsFlugnummer", "BE5678");

  // /fluggastrechte/formular/ankunftszeit
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillInput("ankunftsDatum", "01.01.2022");
  await fluggastrechte.fillInput("ankunftsZeit", "13:20");
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/persoenliche-daten/anzahl
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillDropdownPage("anzahl", "1");

  // /fluggastrechte/formular/persoenliche-daten/name
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillDropdown("title", "");
  await fluggastrechte.fillInput("nachname", "Donatello");
  await fluggastrechte.fillInput("vorname", "Cowabunga");
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/persoenliche-daten/volljaehrig
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillRadioPage("volljaehrig", "yes");

  // /fluggastrechte/formular/persoenliche-daten/adresse
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillInput("strasseHausnummer", "Schildkrötenstraße 5");
  await fluggastrechte.fillInput("plz", "10119");
  await fluggastrechte.fillInput("ort", "Mutant Mayhem");
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/persoenliche-daten/telefonnummer
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillInputPage("telefonnummer", "015111225588");

  // /fluggastrechte/formular/persoenliche-daten/gesetzliche-vertretung
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillRadioPage("gesetzlicheVertretung", "no");

  // /fluggastrechte/formular/persoenliche-daten/bevollmaechtigte-person
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillRadioPage("bevollmaechtigtePerson", "no");

  // /fluggastrechte/formular/entfernung
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillInputPage("entfernung", "300");

  // /fluggastrechte/formular/forderung
  await expectPageToBeAccessible({ page });
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/teilentschaedigung
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillRadioPage("teilentschaedigung", "no");

  // /fluggastrechte/formular/nebenforderungen
  await expectPageToBeAccessible({ page });
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/buchungsbestaetigung
  await expectPageToBeAccessible({ page });
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/schriftverkehr
  await expectPageToBeAccessible({ page });
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/frist
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillInputPage("frist", "11.02.2022");

  // /fluggastrechte/formular/versaeumnisurteil
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillRadioPage("versaeumnisurteil", "no");

  // /fluggastrechte/formular/anmerkung
  await expectPageToBeAccessible({ page });
  await fluggastrechte.fillTextareaPage("anmerkung", "Get some pizza!");

  // /fluggastrechte/formular/ueberpruefung
  await expectPageToBeAccessible({ page });
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/aenderungMitteilung
  await expectPageToBeAccessible({ page });
  await fluggastrechte.clickLabelFor("aenderungMitteilung");
  await fluggastrechte.clickNext();

  // /fluggastrechte/formular/einverstaendnis
  await expectPageToBeAccessible({ page });
  await expect(
    page.getByRole("heading").filter({
      hasText: "Prüfen Sie Ihre Angaben",
    }),
  ).toHaveCount(1);
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${fluggastrechte.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(
    new RegExp(`.+${fluggastrechte.url}/${fluggastrechte.initialStep}$`),
  );
});

test("funnel: last enabled step can be accessed directly", async ({ page }) => {
  await page.goto(`${fluggastrechte.url}/versand/einverstaendnis`);
  await expect(page).toHaveURL(
    new RegExp(`.+${fluggastrechte.url}/versand/einverstaendnis$`),
  );
});
