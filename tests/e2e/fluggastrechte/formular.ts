import { Page, expect } from "@playwright/test";
import type { FluggastrechteFormular } from "../pom/FluggastrechteFormular";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

export async function startFluggastrechteFormular(
  page: Page,
  formular: FluggastrechteFormular,
) {
  await formular.goto();
  await expect(page).toHaveURL(
    new RegExp(`.+${formular.url}/${formular.initialStep}$`),
  );

  // /fluggastrechte/formular/start
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/dokumente
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/daten-uebernahme
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("doMigration", "yes");

  // /fluggastrechte/formular/zwischenstopps
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("zwischenstopps", "no");

  // /fluggastrechte/formular/flugdaten/flug-details-single-flugnummer
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("singleFlugnummer", "EJ 1234");

  // /fluggastrechte/formular/flugdaten/flug-details-single-abflug
  await expectPageToBeAccessible({ page });
  await formular.fillInput("singleAbflugDatum", "12.12.2022");
  await formular.fillInput("singleAbflugZeit", "10:00");
  await formular.clickNext();

  // /fluggastrechte/formular/flugdaten/flug-details-single-ankunft
  await expectPageToBeAccessible({ page });
  await formular.fillInput("singleAnkunftDatum", "12.12.2022");
  await formular.fillInput("singleAnkunftZeit", "10:00");
  await formular.clickNext();

  // /fluggastrechte/formular/ankunft
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("ankunftWithSameFlight", "no");

  // /fluggastrechte/formular/ankunft-flugnummer
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("ankunftsFlugnummer", "BE5678");

  // /fluggastrechte/formular/ankunftszeit
  await expectPageToBeAccessible({ page });
  await formular.fillInput("ankunftsDatum", "01.01.2022");
  await formular.fillInput("ankunftsZeit", "13:20");
  await formular.clickNext();

  // /fluggastrechte/formular/flugdaten/anzahl
  await expectPageToBeAccessible({ page });
  await formular.fillDropdownPage("anzahl", "1");

  // /fluggastrechte/formular/persoenliche-daten/person/forderung-mehrere-personen
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("forderungMehrerePersonen", "no");

  // /fluggastrechte/formular/persoenliche-daten/person/daten
  await expectPageToBeAccessible({ page });
  await formular.fillDropdown("anrede", "mr");
  await formular.fillDropdown("title", " ");
  await formular.fillInput("nachname", "Donatello");
  await formular.fillInput("vorname", "Cowabunga");
  await formular.fillInput("strasseHausnummer", "Schildkrötenstraße 5");
  await formular.fillInput("plz", "10119");
  await formular.fillInput("ort", "Mutant Mayhem");
  await formular.fillInput("telefonnummer", "015111225588");
  await formular.clickNext();

  // /fluggastrechte/formular/persoenliche-daten/person/antragsteller-angeben
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("isProzessbevollmaechtigte", "no");

  // /fluggastrechte/formular/forderung
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/teilentschaedigung
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("teilentschaedigung", "no");

  // /fluggastrechte/formular/nebenforderungen
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/frist
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("frist", "11.02.2022");

  // /fluggastrechte/formular/versaeumnisurteil
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("versaeumnisurteil", "no");

  // /fluggastrechte/formular/anmerkung
  await expectPageToBeAccessible({ page });
  await formular.fillTextareaPage("anmerkung", "Get some pizza!");

  // /fluggastrechte/formular/ueberpruefung
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/aenderungMitteilung
  await expectPageToBeAccessible({ page });
  await formular.clickLabelFor("aenderungMitteilung");
  await formular.clickNext();

  // /fluggastrechte/formular/einverstaendnis
  await expectPageToBeAccessible({ page });
  await expect(
    page.getByRole("heading").filter({
      hasText: "Prüfen Sie Ihre Angaben",
    }),
  ).toHaveCount(1);
}
