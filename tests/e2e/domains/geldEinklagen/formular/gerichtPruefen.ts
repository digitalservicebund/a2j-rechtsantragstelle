import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { type GeldEinklagenFormular } from "./GeldEinklagenFormular";

export async function startGerichtPruefen(formular: GeldEinklagenFormular) {
  // /geld-einklagen/formular/gericht-pruefen/intro/start
  await expectPageToBeAccessible(formular);
  await formular.clickNext();

  // /geld-einklagen/formular/gericht-pruefen/forderung/fragen
  await formular.fillRadioPage("forderung", "maximal5000");

  // /geld-einklagen/formular/gericht-pruefen/sachgebiet/info
  await formular.clickNext();

  // /geld-einklagen/formular/gericht-pruefen/sachgebiet/ausgeschlossen
  await formular.fillRadioPage("sachgebietAusgeschlossen", "no");

  // /geld-einklagen/formular/gericht-pruefen/sachgebiet/besondere
  await formular.fillRadioPage("besondere", "miete");

  // /geld-einklagen/formular/gericht-pruefen/sachgebiet/miete-pacht-vertrag
  await formular.fillRadioPage("mietePachtVertrag", "yes");

  // /geld-einklagen/formular/gericht-pruefen/sachgebiet/miete-pacht-raum
  await formular.fillRadioPage("mietePachtRaum", "no");
}
