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
  await startFinanzielleAngaben(page);
  await startPersoenlicheDaten(page);
  await startAbgabe(page);
});

async function startAbgabe(page: Page) {
  // beratungshilfe/antrag/abgabe/art
  // FIXME: This step is not accessible
  // await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("abgabeArt", "ausdrucken");
  // beratungshilfe/antrag/abgabe/ausdrucken
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.hasAntragDownloadButton();
}

async function startPersoenlicheDaten(page: Page) {
  // beratungshilfe/antrag/persoenlicheDaten/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenlicheDaten/name
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput("vorname", "Donald");
  await beratungshilfeFormular.fillInput("nachname", "Duck");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenlicheDaten/geburtsdatum
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("geburtsdatum", "01.01.1934");

  // beratungshilfe/antrag/persoenlicheDaten/adresse
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput(
    "strasseHausnummer",
    "Entenhausenstraße 123",
  );
  await beratungshilfeFormular.fillInput("plz", "12345");
  await beratungshilfeFormular.fillInput("ort", "Entenhausen");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/persoenlicheDaten/telefonnummer
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("telefonnummer", "123456789");

  // beratungshilfe/antrag/persoenlicheDaten/danke
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();
}

async function startFinanzielleAngaben(page: Page) {
  await startFinanzielleAngabenEinkommen(page);
  await startFinanzielleAngabenPartner(page);
  await startFinanzielleAngabenKinder(page);
  await startFinanzielleAngabenBesitz(page);

  // beratungshilfe/antrag/finanzielleAngaben/besitz/zusammenfassung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/danke
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();
}

async function startFinanzielleAngabenPartner(page: Page) {
  // beratungshilfe/antrag/finanzielleAngaben/partner/partnerschaft
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("partnerschaft", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/partner/zusammenleben
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("zusammenleben", "no");

  // beratungshilfe/antrag/finanzielleAngaben/partner/unterhalt
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("unterhalt", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/partner/unterhalts-summe
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("unterhaltsSumme", "100");

  // beratungshilfe/antrag/finanzielleAngaben/partner/partner-name
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput("partnerVorname", "Dagobert");
  await beratungshilfeFormular.fillInput("partnerNachname", "Duck");
  await beratungshilfeFormular.clickNext();
}

async function startFinanzielleAngabenKinder(page: Page) {
  // beratungshilfe/antrag/finanzielleAngaben/kinder/kinder-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasKinder", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/kinder/zusammenfassung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickAnchorByText("Kind hinzufügen");

  // beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/0/name
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput("kinder#vorname", "Clara");
  await beratungshilfeFormular.fillInput("kinder#nachname", "Musterian");
  await beratungshilfeFormular.fillInput("kinder#geburtsdatum", "12.12.1992");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/0/wohnort
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage(
    "kinder#wohnortBeiAntragsteller",
    "yes",
  );

  // beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/0/kind-eigene-einnahmen-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("kinder#eigeneEinnahmen", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/0/kind-eigene-einnahmen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("kinder#einnahmen", "5");

  // beratungshilfe/antrag/finanzielleAngaben/kinder/zusammenfassung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();
}

async function startFinanzielleAngabenBesitz(page: Page) {
  // beratungshilfe/antrag/finanzielleAngaben/besitz/bankkonten-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasBankkonto", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/bankkonten
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillDropdown(
    "bankkonten#kontoEigentuemer",
    "myself",
  );
  await beratungshilfeFormular.fillInput(
    "bankkonten#bankName",
    "Glatzenkogel in Entenhausen",
  );
  await beratungshilfeFormular.fillInput("bankkonten#kontostand", "100");
  await beratungshilfeFormular.fillInput(
    "bankkonten#iban",
    "176671176167176761",
  );
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/besitz/weiteres-bankkonto
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasAdditionalBankkonto", "no");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/kraftfahrzeuge-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasKraftfahrzeug", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/kraftfahrzeuge
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillDropdown(
    "kraftfahrzeuge#eigentuemer",
    "myself",
  );
  await beratungshilfeFormular.fillInput("kraftfahrzeuge#art", "Trabant");
  await beratungshilfeFormular.fillInput("kraftfahrzeuge#marke", "601");
  await beratungshilfeFormular.fillInput(
    "kraftfahrzeuge#kilometerstand",
    "999999",
  );
  await beratungshilfeFormular.fillInput("kraftfahrzeuge#verkaufswert", "1");
  await beratungshilfeFormular.fillInput("kraftfahrzeuge#baujahr", "1957");
  await beratungshilfeFormular.fillInput(
    "kraftfahrzeuge#anschaffungsjahr",
    "1991",
  );
  await beratungshilfeFormular.fillCheckboxes("kraftfahrzeuge#arbeitsweg");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/besitz/weiteres-kraftfahrzeug
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage(
    "hasAdditionalKraftfahrzeug",
    "no",
  );

  // beratungshilfe/antrag/finanzielleAngaben/besitz/geldanlagen-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasGeldanlage", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/geldanlagen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillDropdown(
    "geldanlagen#eigentuemer",
    "myself",
  );
  await beratungshilfeFormular.fillDropdown("geldanlagen#art", "lifeInsurance");
  await beratungshilfeFormular.fillInput(
    "geldanlagen#verwendungszweck",
    "Altersvorsorge",
  );
  await beratungshilfeFormular.fillInput("geldanlagen#auszahlungwert", "100");
  await beratungshilfeFormular.fillInput(
    "geldanlagen#auszahlungdatum",
    "01.01.2050",
  );
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/besitz/weitere-geldanlage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasAdditionalGeldanlage", "no");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/grundeigentum-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasGrundeigentum", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/grundeigentum
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillDropdown(
    "grundeigentum#eigentuemer",
    "myself",
  );
  await beratungshilfeFormular.fillDropdown("grundeigentum#art", "apartment");
  await beratungshilfeFormular.fillInput("grundeigentum#flaeche", "100");
  await beratungshilfeFormular.fillInput("grundeigentum#verkaufswert", "10");
  await beratungshilfeFormular.fillInput(
    "grundeigentum#strassehausnummer",
    "Berlinadestraße 123",
  );
  await beratungshilfeFormular.fillInput("grundeigentum#plz", "12345");
  await beratungshilfeFormular.fillInput("grundeigentum#ort", "Berlin");
  await beratungshilfeFormular.fillInput("grundeigentum#land", "Deutschland");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/besitz/weiteres-grundeigentum
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage(
    "hasAdditionalGrundeigentum",
    "no",
  );

  // beratungshilfe/antrag/finanzielleAngaben/besitz/wertsachen-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasWertsache", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/wertsachen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillDropdown("wertsachen#art", "cash");
  await beratungshilfeFormular.fillDropdown("wertsachen#eigentuemer", "myself");
  await beratungshilfeFormular.fillInput("wertsachen#wert", "1000");
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/besitz/weitere-wertsache
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("hasAdditionalWertsache", "no");
}

async function startFinanzielleAngabenEinkommen(page: Page) {
  // beratungshilfe/antrag/finanzielleAngaben/einkommen/staatliche-leistungen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("staatlicheLeistungen", "keine");

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/erwerbstaetig
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("erwerbstaetig", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/art
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillCheckboxesPage(
    "berufart.selbststaendig",
    "berufart.festangestellt",
  );

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/situation
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("berufsituation", "student");

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/weiteres-einkommen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillCheckboxesPage(
    "weitereseinkommen.unterhaltszahlungen",
    "weitereseinkommen.wohngeld",
  );

  // beratungshilfe/antrag/finanzielleAngaben/einkommen/weiteres-einkommen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInputPage("einkommen", "100");
}

async function startRechtsproblem(page: Page) {
  // beratungshilfe/antrag/rechtsproblem/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/rechtsproblem/bereich
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("bereich", "authorities");

  // beratungshilfe/antrag/rechtsproblem/beschreibung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillTextareaPage(
    "beschreibung",
    "Ich habe ein Problem mit der Verwaltung",
  );

  // beratungshilfe/antrag/rechtsproblem/eigeninitiative
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("eigeninitiative", "yes");

  // beratungshilfe/antrag/rechtsproblem/eigeninitiativeBeschreibung
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillTextareaPage(
    "eigeninitiativeBeschreibung",
    "Ich habe das Problem berichtet",
  );

  // beratungshilfe/antrag/rechtsproblem/sonstiges
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillTextareaPage(
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

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${beratungshilfeFormular.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(
    new RegExp(
      `.+${beratungshilfeFormular.url}/${beratungshilfeFormular.initialStep}$`,
    ),
  );
});

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
