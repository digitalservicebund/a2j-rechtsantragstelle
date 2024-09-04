import { faker } from "@faker-js/faker";
import type { Page } from "@playwright/test";
import type { Formular } from "tests/e2e/pom/Formular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startFinanzielleAngabenEinkuenfte(
  page: Page,
  formular: Formular,
) {
  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/staatliche-leistungen
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("staatlicheLeistungenPKH", "buergergeld");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/buergergeld
  await expectPageToBeAccessible({ page });
  await formular.fillInput("buergergeld", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("currentlyEmployed", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/einkommen/art
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("employmentType", "employedAndSelfEmployed");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/einkommen/netto-einkommen
  await expectPageToBeAccessible({ page });
  await formular.fillInput(
    "nettoEinkuenfteAlsArbeitnehmer",
    faker.finance.amount(),
  );
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/einkommen/selbststaendig
  await expectPageToBeAccessible({ page });
  await formular.fillInput(
    "selbststaendigMonatlichesEinkommen",
    faker.finance.amount(),
  );
  await formular.fillRadioPage("selbststaendigBruttoNetto", "brutto");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/einkommen/selbststaendig-abzuege
  await expectPageToBeAccessible({ page });
  await formular.fillInput("selbststaendigAbzuege", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsweg
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("arbeitsweg", "publicTransport");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/opnv-kosten
  await expectPageToBeAccessible({ page });
  await formular.fillInput("monatlicheOPNVKosten", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsplatz-entfernung
  await expectPageToBeAccessible({ page });
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
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("hasArbeitsausgaben", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/uebersicht
  await expectPageToBeAccessible({ page });
  await formular.clickAnchorByText("Ausgabe hinzufügen");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgabe/0/daten
  await expectPageToBeAccessible({ page });
  await formular.fillInput("arbeitsausgaben#beschreibung", faker.word.sample());
  await formular.fillInput("arbeitsausgaben#betrag", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/uebersicht
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/rente-frage
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("receivesPension", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/rente
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("pensionAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/unterhalt-frage
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("receivesSupport", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/unterhalt
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("supportAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/leistungen/frage
  await expectPageToBeAccessible({ page });
  await formular.fillCheckboxesPage(
    "hasWohngeld",
    "hasKrankengeld",
    "hasElterngeld",
    "hasKindergeld",
  );

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/leistungen/wohngeld
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("wohngeldAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/leistungen/krankengeld
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("krankengeldAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/leistungen/elterngeld
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("elterngeldAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/leistungen/kindergeld
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("kindergeldAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("hasFurtherIncome", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht
  await expectPageToBeAccessible({ page });
  await formular.clickAnchorByText("Einkunft hinzufügen");

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/weitere-einkuenfte/einkunft/0/daten
  await expectPageToBeAccessible({ page });
  await formular.fillInput(
    "weitereEinkuenfte#beschreibung",
    faker.word.sample(),
  );
  await formular.fillInput("weitereEinkuenfte#betrag", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht
  await expectPageToBeAccessible({ page });
  await formular.clickNext();
}
