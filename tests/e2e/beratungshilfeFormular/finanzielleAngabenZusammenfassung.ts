import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

export async function startFinanzielleAngabenZusammenfassung(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/finanzielleAngaben/besitzZusammenfassung/zusammenfassung
  await expectPageToBeAccessible({ page });
  await addBankkonto(page, beratungshilfeFormular);
  await addKraftfahrzeug(beratungshilfeFormular, page);
  await addGeldanlage(beratungshilfeFormular, page);
  await addGrundeigentum(beratungshilfeFormular, page);
  await addWertsachen(beratungshilfeFormular, page);
}

async function addWertsachen(
  beratungshilfeFormular: BeratungshilfeFormular,
  page: Page,
) {
  await page.getByTestId("add-wertsachen").click();

  // beratungshilfe/antrag/finanzielleAngaben/besitz/wertgegenstaende
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillInput("wertsachen#art", "Bargeld");
  await beratungshilfeFormular.fillDropdown("wertsachen#eigentuemer", "myself");
  await beratungshilfeFormular.fillInput("wertsachen#wert", "1000");
  await beratungshilfeFormular.clickNext();
}

async function addGrundeigentum(
  beratungshilfeFormular: BeratungshilfeFormular,
  page: Page,
) {
  await page.getByTestId("add-grundeigentum").click();

  // beratungshilfe/antrag/finanzielleAngaben/besitzZusammenfassung/grundeigentum/0/bewohnt-frage
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("grundeigentum#istBewohnt", "yes");

  // beratungshilfe/antrag/finanzielleAngaben/besitzZusammenfassung/grundeigentum/0/daten
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillDropdown("grundeigentum#art", "apartment");
  await beratungshilfeFormular.fillDropdown(
    "grundeigentum#eigentuemer",
    "myself",
  );
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
}

async function addGeldanlage(
  beratungshilfeFormular: BeratungshilfeFormular,
  page: Page,
) {
  await page.getByTestId("add-geldanlagen").click();

  // beratungshilfe/antrag/finanzielleAngaben/besitzZusammenfassung/geldanlagen/0/art
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("geldanlagen#art", "bargeld");

  // beratungshilfe/antrag/finanzielleAngaben/besitzZusammenfassung/geldanlagen/0/bargeld
  expect(page.url()).toContain("bargeld");
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillDropdown(
    "geldanlagen#eigentuemer",
    "myself",
  );
  await beratungshilfeFormular.fillInput("geldanlagen#wert", "100");
  await beratungshilfeFormular.clickNext();
}

async function addKraftfahrzeug(
  beratungshilfeFormular: BeratungshilfeFormular,
  page: Page,
) {
  await page.getByTestId("add-kraftfahrzeuge").click();

  // beratungshilfe/antrag/finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/arbeitsweg
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage(
    "kraftfahrzeuge#hasArbeitsweg",
    "yes",
  );

  // beratungshilfe/antrag/finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/wert
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage(
    "kraftfahrzeuge#wert",
    "over10000",
  );

  // beratungshilfe/antrag/finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/fahrzeuge
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

  await beratungshilfeFormular.clickNext();
}

async function addBankkonto(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  await page.getByTestId("add-bankkonten").click();

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
}
