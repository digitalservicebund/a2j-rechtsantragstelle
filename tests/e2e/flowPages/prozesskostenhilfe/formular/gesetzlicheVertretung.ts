import { faker } from "@faker-js/faker";
import { type Page } from "@playwright/test";
import type { Formular } from "tests/e2e/pom/Formular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startGesetzlicheVertretung(
  page: Page,
  formular: Formular,
) {
  // prozesskostenhilfe/formular/gesetzliche-vertretung/start
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("hasGesetzlicheVertretung", "yes");

  // prozesskostenhilfe/formular/gesetzliche-vertretung/daten
  await formular.fillInput(
    "gesetzlicheVertretungDaten.vorname",
    faker.person.firstName(),
  );
  await formular.fillInput(
    "gesetzlicheVertretungDaten.nachname",
    faker.person.lastName(),
  );
  await formular.fillInput(
    "gesetzlicheVertretungDaten.strasseHausnummer",
    faker.location.streetAddress(),
  );
  await formular.fillInput("gesetzlicheVertretungDaten.plz", "10115");
  await formular.fillInput(
    "gesetzlicheVertretungDaten.ort",
    faker.location.city(),
  );
  await formular.fillInput(
    "gesetzlicheVertretungDaten.telefonnummer",
    faker.phone.number(),
  );
  await formular.clickNext();
}
