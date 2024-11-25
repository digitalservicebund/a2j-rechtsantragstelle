import type { ProzesskostenhilfeFormular } from "tests/e2e/domains/prozesskostenhilfe/formular/ProzesskostenhilfeFormular";

export async function startAntragstellendePerson(
  formular: ProzesskostenhilfeFormular,
) {
  // /prozesskostenhilfe/formular/antragstellende-person/empfaenger
  await formular.fillRadioPage("empfaenger", "ich");

  // /prozesskostenhilfe/formular/antragstellende-person/unterhaltsanspruch
  await formular.fillRadioPage("unterhaltsanspruch", "keine");
}
