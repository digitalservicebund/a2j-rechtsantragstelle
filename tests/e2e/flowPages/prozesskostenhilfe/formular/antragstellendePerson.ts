import type { Page } from "@playwright/test";
import type { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startAntragstellendePerson(
  page: Page,
  formular: ProzesskostenhilfeFormular,
) {
  // /prozesskostenhilfe/formular/antragstellende-person/empfaenger
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("empfaenger", "ich");

  // /prozesskostenhilfe/formular/antragstellende-person/unterhaltsanspruch
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("unterhaltsanspruch", "unterhalt");

  // /prozesskostenhilfe/formular/antragstellende-person/unterhalt
  await expectPageToBeAccessible({ page });
  await formular.fillInputPage("unterhaltssumme", "100");

  // /prozesskostenhilfe/formular/antragstellende-person/unterhalt-hauptsaechliches-leben
  await expectPageToBeAccessible({ page });
  await formular.fillRadioPage("livesPrimarilyFromUnterhalt", "yes");

  // /prozesskostenhilfe/formular/antragstellende-person/unterhaltspflichtige-person
  await expectPageToBeAccessible({ page });
  await formular.fillDropdown("unterhaltspflichtigePerson.beziehung", "mutter");
  await formular.fillInput("unterhaltspflichtigePerson.vorname", "Tom");
  await formular.fillInputPage("unterhaltspflichtigePerson.nachname", "Tom");

  // /prozesskostenhilfe/formular/antragstellende-person/eigenes-exemplar
  await expectPageToBeAccessible({ page });
  await formular.clickNext();
}
