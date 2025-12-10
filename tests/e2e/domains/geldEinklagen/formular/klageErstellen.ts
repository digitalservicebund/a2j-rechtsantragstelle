import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { type GeldEinklagenFormular } from "./GeldEinklagenFormular";

export async function startKlagenErstellen(formular: GeldEinklagenFormular) {
  // /geld-einklagen/formular/klage-erstellen/intro/start
  await expectPageToBeAccessible(formular);

  // /geld-einklagen/formular/klage-erstellen/streitwert-kosten/gerichtskostenvorschuss
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/streitwert-kosten/weitere-kosten
  await formular.clickNext();
}
