import { fakerDE as faker } from "@faker-js/faker";
import { Page, expect } from "@playwright/test";
import type { FluggastrechteFormular } from "../pom/FluggastrechteFormular";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";
import { today, toGermanDateFormat } from "~/util/date";

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

  // /fluggastrechte/formular/flugdaten/geplanter-flug
  await expectPageToBeAccessible({ page });
  await formular.fillInput("direktFlugnummer", "AB1234");
  await formular.fillInput("direktAbflugsDatum", toGermanDateFormat(today()));
  await formular.fillInput("direktAbflugsZeit", "08:10");
  await formular.fillInput("direktAnkunftsDatum", toGermanDateFormat(today()));
  await formular.fillInput("direktAnkunftsZeit", "10:10");
  await formular.clickNext();

  // /fluggastrechte/formular/zwischenstopps
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("zwischenstopps", "no");

  // /fluggastrechte/formular/flugdaten/tatsaechlicher-flug
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("tatsaechlicherFlug", "yes");

  // /fluggastrechte/formular/flugdaten/tatsaechlicher-flug-ankunft
  await expectPageToBeAccessible({ page });
  await formular.fillInput(
    "tatsaechlicherAnkunftsDatum",
    toGermanDateFormat(today()),
  );
  await formular.fillInput("tatsaechlicherAnkunftsZeit", "10:10");
  await formular.clickNext();

  // /fluggastrechte/formular/persoenliche-daten/anzahl
  await expectPageToBeAccessible({ page });
  await formular.fillDropdownPage("anzahl", "1");

  // /fluggastrechte/formular/persoenliche-daten/name
  await expectPageToBeAccessible({ page });
  await formular.fillDropdown("title", "");
  await formular.fillInput("nachname", "Donatello");
  await formular.fillInput("vorname", "Cowabunga");
  await formular.clickNext();

  // /fluggastrechte/formular/persoenliche-daten/volljaehrig
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("volljaehrig", "yes");

  // /fluggastrechte/formular/persoenliche-daten/adresse
  await expectPageToBeAccessible({ page });
  await formular.fillInput("strasseHausnummer", "Schildkrötenstraße 5");
  await formular.fillInput("plz", "10119");
  await formular.fillInput("ort", "Mutant Mayhem");
  await formular.clickNext();

  // /fluggastrechte/formular/persoenliche-daten/telefonnummer
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("telefonnummer", "015111225588");

  // /fluggastrechte/formular/persoenliche-daten/gesetzliche-vertretung
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("gesetzlicheVertretung", "no");

  // /fluggastrechte/formular/persoenliche-daten/bevollmaechtigte-person
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("bevollmaechtigtePerson", "no");

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
