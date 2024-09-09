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

  // /fluggastrechte/formular/streitwert-kosten/gerichtskosten
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/streitwert-kosten/andere-kosten
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /fluggastrechte/formular/streitwert-kosten/zahlung-nach-klageeinreichung
  await expectPageToBeAccessible({ page });
  await formular.clickLabelFor("aenderungMitteilung");
  await formular.clickNext();

  // /fluggastrechte/formular/streitwert-kosten/prozesszinsen
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("prozesszinsen", "yes");

  // /fluggastrechte/formular/streitwert-kosten/versaeumnisurteil
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("versaeumnisurteil", "yes");

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

  // fluggastrechte/formular/zusammenfassung/start
  await expectPageToBeAccessible({ page });
  await expect(page).toHaveURL(
    new RegExp(`.+${formular.url}/zusammenfassung/start$`),
  );
}
