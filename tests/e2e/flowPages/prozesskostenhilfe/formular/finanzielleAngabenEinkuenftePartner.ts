import { faker } from "@faker-js/faker";
import type { Page } from "@playwright/test";
import type { Formular } from "tests/e2e/pom/Formular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startFinanzielleAngabenEinkuenftePartner(
  page: Page,
  formular: Formular,
) {
  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-staatliche-leistungen
  await formular.fillRadioPage("partner-staatlicheLeistungen", "buergergeld");

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-buergergeld
  await formular.fillInput("partner-buergergeld", faker.finance.amount());
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-einkommen/partner-erwerbstaetig
  await formular.fillRadioPage("partner-currentlyEmployed", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-einkommen/partner-art
  await formular.fillRadioPage(
    "partner-employmentType",
    "employedAndSelfEmployed",
  );

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-einkommen/partner-netto-einkommen
  await formular.fillInput(
    "partner-nettoEinkuenfteAlsArbeitnehmer",
    faker.finance.amount(),
  );
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-einkommen/partner-selbststaendig
  await formular.fillInput(
    "partner-selbststaendigMonatlichesEinkommen",
    faker.finance.amount(),
  );
  await formular.fillRadioPage("partner-selbststaendigBruttoNetto", "brutto");

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-einkommen/partner-selbststaendig-abzuege
  await formular.fillInput(
    "partner-selbststaendigAbzuege",
    faker.finance.amount(),
  );
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-abzuege/partner-arbeitsweg
  await formular.fillRadioPage("partner-arbeitsweg", "publicTransport");

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-abzuege/partner-opnv-kosten
  await formular.fillInput(
    "partner-monatlicheOPNVKosten",
    faker.finance.amount(),
  );
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-abzuege/partner-arbeitsplatz-entfernung
  await formular.fillInput(
    "partner-arbeitsplatz.strasseHausnummer",
    faker.location.streetAddress(),
  );
  await formular.fillInput("partner-arbeitsplatz.ort", faker.location.city());
  await formular.fillInput("partner-arbeitsplatz.plz", "10629");
  await formular.fillInput(
    "partner-arbeitsplatzEntfernung",
    faker.number.int({ min: 1, max: 100 }).toString(),
  );
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-frage
  await formular.fillRadioPage("partner-hasArbeitsausgaben", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht
  await expectPageToBeAccessible({ page });
  await formular.clickAnchorByText("Ausgabe hinzufügen");

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgabe/0/partner-daten
  await formular.fillInput(
    "partner-arbeitsausgaben#beschreibung",
    faker.word.sample(),
  );
  await formular.fillInput(
    "partner-arbeitsausgaben#betrag",
    faker.finance.amount(),
  );
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-rente-frage
  await formular.fillRadioPage("partner-receivesPension", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-rente
  await formular.fillInputPage("partner-pensionAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-unterhalt-frage
  await formular.fillRadioPage("partner-receivesSupport", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-unterhalt
  await formular.fillInputPage("partner-supportAmount", faker.finance.amount());

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-leistungen/partner-frage
  await formular.fillCheckboxesPage(
    "partner-hasWohngeld",
    "partner-hasKrankengeld",
    "partner-hasElterngeld",
    "partner-hasKindergeld",
  );

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-leistungen/partner-wohngeld
  await formular.fillInputPage(
    "partner-wohngeldAmount",
    faker.finance.amount(),
  );

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-leistungen/partner-krankengeld
  await formular.fillInputPage(
    "partner-krankengeldAmount",
    faker.finance.amount(),
  );

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-leistungen/partner-elterngeld
  await formular.fillInputPage(
    "partner-elterngeldAmount",
    faker.finance.amount(),
  );

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-leistungen/partner-kindergeld
  await formular.fillInputPage(
    "partner-kindergeldAmount",
    faker.finance.amount(),
  );

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-weitere-einkuenfte/partner-frage
  await formular.fillRadioPage("partner-hasFurtherIncome", "yes");

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-weitere-einkuenfte/partner-uebersicht
  await expectPageToBeAccessible({ page });
  await formular.clickAnchorByText("Einkunft hinzufügen");

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-weitere-einkuenfte/partner-einkunft/0/partner-daten
  await formular.fillInput(
    "partner-weitereEinkuenfte#beschreibung",
    faker.word.sample(),
  );
  await formular.fillInput(
    "partner-weitereEinkuenfte#betrag",
    faker.finance.amount(),
  );
  await formular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-weitere-einkuenfte/partner-uebersicht
  await formular.clickNext();
}
