import { type Page, expect } from "@playwright/test";
import type { FluggastrechteFormular } from "tests/e2e/pom/FluggastrechteFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { today, toGermanDateFormat } from "~/util/date";

export async function startFluggastrechteFormular(
  page: Page,
  formular: FluggastrechteFormular,
) {
  await formular.goto();
  await expect(page).toHaveURL(
    new RegExp(`.+${formular.url}/${formular.initialStep}$`),
  );

  // /fluggastrechte/formular/intro/start
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/grundvorraussetzungen/prozessfaehig
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/grundvorraussetzungen/ausgleichszahlung
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/grundvorraussetzungen/daten-uebernahme
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("doMigration", "yes");

  // /fluggastrechte/formular/flugdaten/geplanter-flug
  await expectPageToBeAccessible({ page });
  await formular.fillInput("direktFlugnummer", "AB1234");
  await formular.fillInput("direktAbflugsDatum", toGermanDateFormat(today()));
  await formular.fillInput("direktAbflugsZeit", "08:10");
  await formular.fillDropdown("zwischenstoppAnzahl", "oneStop");
  await formular.fillInput("direktAnkunftsDatum", toGermanDateFormat(today()));
  await formular.fillInput("direktAnkunftsZeit", "10:10");
  await formular.clickNext();

  // /fluggastrechte/formular/flugdaten/zwischenstopp-uebersicht-1
  await expectPageToBeAccessible({ page });
  await formular.fillAutoSuggestInputPage(
    "input-ersterZwischenstopp",
    "München",
  );
  await formular.clickNext();

  // /fluggastrechte/formular/flugdaten/tatsaechlicher-flug
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("tatsaechlicherFlug", "no");

  // /fluggastrechte/formular/flugdaten/ersatzverbindung-art
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("ersatzverbindungArt", "flug");

  // /fluggastrechte/formular/flugdaten/anderer-flug-ankunft
  await expectPageToBeAccessible({ page });
  await formular.fillInput("ersatzFlugnummer", "BCA4321");
  await formular.fillInput("ersatzFlugAnkunftsDatum", "10.01.2023");
  await formular.fillInput("ersatzFlugAnkunftsZeit", "10:10");
  await formular.clickNext();

  // /fluggastrechte/formular/flugdaten/zusaetzliche-angaben
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/persoenliche-daten/person/daten
  await expectPageToBeAccessible({ page });
  await formular.fillInput("anrede", "Herr");
  await formular.fillDropdown("title", "");
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

  // /fluggastrechte/formular/persoenliche-daten/weitere-personen/frage
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("isWeiterePersonen", "no");

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
