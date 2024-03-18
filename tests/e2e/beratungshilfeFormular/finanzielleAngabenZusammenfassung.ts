import type { Page } from "@playwright/test";
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
  await beratungshilfeFormular.clickAnchorById("add-wertsachen");

  // beratungshilfe/antrag/finanzielleAngaben/besitz/wertsachen
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillDropdown("wertsachen#art", "cash");
  await beratungshilfeFormular.fillDropdown("wertsachen#eigentuemer", "myself");
  await beratungshilfeFormular.fillInput("wertsachen#wert", "1000");
  await beratungshilfeFormular.clickNext();
}

async function addGrundeigentum(
  beratungshilfeFormular: BeratungshilfeFormular,
  page: Page,
) {
  await beratungshilfeFormular.clickAnchorById("add-grundeigentum");

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
  await beratungshilfeFormular.clickAnchorById("add-geldanlagen");

  // beratungshilfe/antrag/finanzielleAngaben/besitzZusammenfassung/geldanlagen/0/daten
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
}

async function addKraftfahrzeug(
  beratungshilfeFormular: BeratungshilfeFormular,
  page: Page,
) {
  await beratungshilfeFormular.clickAnchorById("add-kraftfahrzeuge");

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
}

async function addBankkonto(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  await beratungshilfeFormular.clickAnchorById("add-bankkonten");

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
