import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { Formular } from "../../pom/Formular";
import { expectPageToBeAccessible } from "../../util/expectPageToBeAccessible";

export async function startFinanzielleAngabenEigentumZusammenfassung(
  page: Page,
  formular: Formular,
) {
  // /finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung
  await expectPageToBeAccessible({ page });
  await addBankkonto(page, formular);
  await addKraftfahrzeug(formular, page);
  await addGeldanlage(formular, page);
  await addGrundeigentum(formular, page);
  await addWertsachen(formular, page);
}

async function addWertsachen(formular: Formular, page: Page) {
  await page.getByTestId("add-wertsachen").click();

  // /finanzielle-angaben/eigentum-zusammenfassung/wertgegenstaende
  await expectPageToBeAccessible({ page });
  await formular.fillInput("wertsachen#art", "Bargeld");
  await formular.fillDropdown("wertsachen#eigentuemer", "myself");
  await formular.fillInput("wertsachen#wert", "1000");
  await formular.clickNext();
}

async function addGrundeigentum(formular: Formular, page: Page) {
  await page.getByTestId("add-grundeigentum").click();

  // /finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/0/bewohnt-frage
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("grundeigentum#isBewohnt", "yes");

  // /finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/0/daten
  await expectPageToBeAccessible({ page });
  await formular.fillDropdown("grundeigentum#art", "eigentumswohnung");
  await formular.fillDropdown("grundeigentum#eigentuemer", "myself");
  await formular.fillInput("grundeigentum#flaeche", "100");
  await formular.fillInput("grundeigentum#verkaufswert", "10");
  await formular.clickNext();
}

async function addGeldanlage(formular: Formular, page: Page) {
  await page.getByTestId("add-geldanlagen").click();

  // /finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/art
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("geldanlagen#art", "bargeld");

  // /finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/bargeld
  expect(page.url()).toContain("bargeld");
  await expectPageToBeAccessible({ page });
  await formular.fillDropdown("geldanlagen#eigentuemer", "myself");
  await formular.fillInput("geldanlagen#wert", "100");
  await formular.clickNext();
}

async function addKraftfahrzeug(formular: Formular, page: Page) {
  await page.getByTestId("add-kraftfahrzeuge").click();

  // /finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/arbeitsweg
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("kraftfahrzeuge#hasArbeitsweg", "yes");

  // /finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/wert
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("kraftfahrzeuge#wert", "over10000");

  // /finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/fahrzeuge
  await expectPageToBeAccessible({ page });
  await formular.fillDropdown("kraftfahrzeuge#eigentuemer", "myself");

  await formular.fillInput("kraftfahrzeuge#art", "Trabant");
  await formular.fillInput("kraftfahrzeuge#marke", "601");
  await formular.fillInput("kraftfahrzeuge#kilometerstand", "999999");

  await formular.fillInput("kraftfahrzeuge#verkaufswert", "1");
  await formular.fillInput("kraftfahrzeuge#baujahr", "1957");
  await formular.fillInput("kraftfahrzeuge#anschaffungsjahr", "1991");

  await formular.clickNext();
}

async function addBankkonto(page: Page, formular: Formular) {
  await page.getByTestId("add-bankkonten").click();

  // /finanzielle-angaben/eigentum/bankkonten
  await expectPageToBeAccessible({ page });
  await formular.fillDropdown("bankkonten#kontoEigentuemer", "myself");

  await formular.fillInput(
    "bankkonten#bankName",
    "Glatzenkogel in Entenhausen",
  );

  await formular.fillInput("bankkonten#kontostand", "100");
  await formular.fillInput("bankkonten#iban", "176671176167176761");
  await formular.clickNext();
}
