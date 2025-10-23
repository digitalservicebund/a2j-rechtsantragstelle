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
  await formular.fillRadioPage("ausgeschlossen", "no");

  // /geld-einklagen/formular/gericht-pruefen/sachgebiet/besondere
  await formular.fillRadioPage("sachgebiet", "miete");

  // /geld-einklagen/formular/gericht-pruefen/sachgebiet/miete-pacht-vertrag
  await formular.fillRadioPage("mietePachtVertrag", "yes");

  // /geld-einklagen/formular/gericht-pruefen/sachgebiet/miete-pacht-raum
  await formular.fillRadioPage("mietePachtRaum", "no");

  // /geld-einklagen/formular/gericht-pruefen/klagende-person/fuer-wen
  await formular.fillRadioPage("fuerWenKlagen", "selbst");

  // /geld-einklagen/formular/gericht-pruefen/klagende-person/kaufmann
  await formular.fillRadioPage("klagendeVerbraucher", "no");

  // /geld-einklagen/formular/gericht-pruefen/klagende-person/haustuergeschaeft
  await formular.fillRadioPage("klagendeKaufmann", "yes");

  // /geld-einklagen/formular/gericht-pruefen/beklagte-person/fuer-wen
  await formular.fillRadioPage("fuerWenBeklagen", "person");

  // /geld-einklagen/formular/gericht-pruefen/beklagte-person/kaufmann
  await formular.fillRadioPage("beklagtePersonKaufmann", "yes");

  // /geld-einklagen/formular/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung
  await formular.fillRadioPage("gerichtsstandsvereinbarung", "yes");
}
