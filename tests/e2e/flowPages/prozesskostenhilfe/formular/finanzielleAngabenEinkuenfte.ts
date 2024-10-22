import { faker } from "@faker-js/faker";
import type { Page } from "@playwright/test";
import type { Formular } from "tests/e2e/pom/Formular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startFinanzielleAngabenEinkuenfte(
  page: Page,
  formular: Formular,
) {
  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/staatliche-leistungen
  await formular.fillRadioPage("staatlicheLeistungen", "buergergeld");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/buergergeld
  await formular.fillInput("buergergeld", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig
  await formular.fillRadioPage("currentlyEmployed", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/einkommen/art
  await formular.fillRadioPage("employmentType", "employedAndSelfEmployed");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/einkommen/netto-einkommen
  await formular.fillInput(
    "nettoEinkuenfteAlsArbeitnehmer",
    faker.finance.amount(),
  );
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/einkommen/selbststaendig
  await formular.fillInput(
    "selbststaendigMonatlichesEinkommen",
    faker.finance.amount(),
  );
  await formular.fillRadioPage("selbststaendigBruttoNetto", "brutto");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/einkommen/selbststaendig-abzuege
  await formular.fillInput("selbststaendigAbzuege", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsweg
  await formular.fillRadioPage("arbeitsweg", "publicTransport");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/opnv-kosten
  await formular.fillInput("monatlicheOPNVKosten", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsplatz-entfernung
  await formular.fillInput(
    "arbeitsplatz.strasseHausnummer",
    faker.location.streetAddress(),
  );
  await formular.fillInput("arbeitsplatz.ort", faker.location.city());
  await formular.fillInput("arbeitsplatz.plz", "10629");
  await formular.fillInput(
    "arbeitsplatzEntfernung",
    faker.number.int({ min: 1, max: 100 }).toString(),
  );
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgaben-frage
  await formular.fillRadioPage("hasArbeitsausgaben", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/uebersicht
  await expectPageToBeAccessible({ page });
  await formular.clickAnchorByText("Ausgabe hinzufügen");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgabe/0/daten
  await formular.fillInput("arbeitsausgaben#beschreibung", faker.word.sample());
  await formular.fillInput("arbeitsausgaben#betrag", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/uebersicht
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/rente-frage
  await formular.fillRadioPage("receivesPension", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/rente
  await formular.fillInputPage("pensionAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/leistungen/frage
  await formular.fillCheckboxesPage(
    "hasWohngeld",
    "hasKrankengeld",
    "hasElterngeld",
    "hasKindergeld",
  );

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/leistungen/wohngeld
  await formular.fillInputPage("wohngeldAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/leistungen/krankengeld
  await formular.fillInputPage("krankengeldAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/leistungen/elterngeld
  await formular.fillInputPage("elterngeldAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/leistungen/kindergeld
  await formular.fillInputPage("kindergeldAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage
  await formular.fillRadioPage("hasFurtherIncome", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht
  await expectPageToBeAccessible({ page });
  await formular.clickAnchorByText("Einkunft hinzufügen");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/weitere-einkuenfte/einkunft/0/daten
  await formular.fillInput(
    "weitereEinkuenfte#beschreibung",
    faker.word.sample(),
  );
  await formular.fillInput("weitereEinkuenfte#betrag", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht
  await formular.clickNext();
}
