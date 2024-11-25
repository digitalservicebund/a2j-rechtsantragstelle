import { type Page, expect } from "@playwright/test";
import type { FluggastrechteFormular } from "tests/e2e/domains/fluggastrechte/formular/FluggastrechteFormular";
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

  // /fluggastrechte/formular/grundvoraussetzungen/prozessfaehig
  await formular.clickNext();

  // /fluggastrechte/formular/grundvoraussetzungen/ausgleichszahlung
  await formular.clickNext();

  // /fluggastrechte/formular/grundvoraussetzungen/zahlungsaufforderung
  await formular.fillRadioPage("zahlungsaufforderung", "yes");

  // /fluggastrechte/formular/grundvoraussetzungen/daten-uebernahme
  await formular.clickNext();

  // /fluggastrechte/formular/streitwert-kosten/gerichtskosten
  await formular.clickNext();

  // /fluggastrechte/formular/streitwert-kosten/andere-kosten
  await formular.clickNext();

  // /fluggastrechte/formular/streitwert-kosten/prozesszinsen
  await formular.fillRadioPage("prozesszinsen", "yes");

  // /fluggastrechte/formular/flugdaten/geplanter-flug

  // We need a timeout here to load this component otherwise the input value is gone
  await page.waitForSelector("[data-testid=input-startAirport-loaded]");
  await formular.fillInput("direktFlugnummer", "AB1234");
  await formular.fillInput("buchungsNummer", "X36Q9C");
  await formular.fillInput("direktAbflugsDatum", toGermanDateFormat(today()));
  await formular.fillInput("direktAbflugsZeit", "08:10");
  await formular.fillDropdown("zwischenstoppAnzahl", "oneStop");
  await formular.fillInput("direktAnkunftsDatum", toGermanDateFormat(today()));
  await formular.fillInput("direktAnkunftsZeit", "10:10");
  await formular.clickNext();

  // /fluggastrechte/formular/flugdaten/zwischenstopp-uebersicht-1
  await formular.fillAutoSuggestInputPage(
    "input-ersterZwischenstopp",
    "München",
  );
  await formular.clickNext();

  // /fluggastrechte/formular/flugdaten/verspaeteter-flug-1
  await formular.fillRadioPage(
    "verspaeteterFlug",
    "startAirportFirstZwischenstopp",
  );

  // /fluggastrechte/formular/flugdaten/anschluss-flug-verpasst
  await formular.fillRadioPage("anschlussFlugVerpasst", "yes");

  // /fluggastrechte/formular/flugdaten/tatsaechlicher-flug
  await formular.fillRadioPage("tatsaechlicherFlug", "no");

  // /fluggastrechte/formular/flugdaten/ersatzverbindung-art
  await formular.fillRadioPage("ersatzverbindungArt", "flug");

  // /fluggastrechte/formular/flugdaten/anderer-flug-ankunft
  await formular.fillInput("ersatzFlugnummer", "BCA4321");
  await formular.fillInput("ersatzFlugAnkunftsDatum", "10.01.2023");
  await formular.fillInput("ersatzFlugAnkunftsZeit", "10:10");
  await formular.clickNext();

  // /fluggastrechte/formular/flugdaten/zusaetzliche-angaben
  await formular.clickNext();

  // /fluggastrechte/formular/persoenliche-daten/person/daten
  await formular.fillInput("anrede", "Herr");
  await formular.fillDropdown("title", "");
  await formular.fillInput("nachname", "Donatello");
  await formular.fillInput("vorname", "Cowabunga");
  await formular.fillInput("strasseHausnummer", "Schildkrötenstraße 5");
  await formular.fillInput("plz", "10119");
  await formular.fillInput("ort", "Mutant Mayhem");
  await formular.fillInput("telefonnummer", "015111225588");
  await formular.clickNext();

  // /fluggastrechte/formular/persoenliche-daten/weitere-personen/frage
  await formular.fillRadioPage("isWeiterePersonen", "no");

  // /fluggastrechte/formular/persoenliche-daten/weitere-personen/zeugen
  await formular.fillRadioPage("hasZeugen", "no");

  // /fluggastrechte/formular/streitwert-kosten/schriftliches-verfahren
  await formular.fillRadioPage("schriftlichesVerfahren", "yes");

  // /fluggastrechte/formular/streitwert-kosten/videoverhandlung
  await formular.fillRadioPage("videoverhandlung", "yes");

  // /fluggastrechte/formular/prozessfuehrung/versaeumnisurteil
  await formular.fillRadioPage("versaeumnisurteil", "yes");

  // /fluggastrechte/formular/prozessfuehrung/zahlung-nach-klageeinreichung
  await formular.clickNext();

  // fluggastrechte/formular/zusammenfassung/start
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // fluggastrechte/formular/abgabe/start
  await expectPageToBeAccessible({ page });
  await expect(page).toHaveURL(new RegExp(`.+${formular.url}/abgabe/start$`));
}
