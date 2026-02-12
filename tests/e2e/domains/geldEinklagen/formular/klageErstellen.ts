import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { type GeldEinklagenFormular } from "./GeldEinklagenFormular";

export async function startKlagenErstellen(formular: GeldEinklagenFormular) {
  // /geld-einklagen/formular/klage-erstellen/intro/start
  await expectPageToBeAccessible(formular);
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/streitwert-kosten/gerichtskostenvorschuss
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/streitwert-kosten/weitere-kosten
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/klagende-person/kontaktdaten
  await formular.fillInput("klagendePersonVorname", "Donatello");
  await formular.fillInput("klagendePersonNachname", "Cowabunga");
  await formular.fillInput(
    "klagendePersonStrasseHausnummer",
    "Schildkrötenstraße 5",
  );
  await formular.fillInput("klagendePersonPlz", "10119");
  await formular.fillInput("klagendePersonOrt", "Mutant Mayhem");
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/beklagte-person/mensch
  await formular.fillInput("beklagteVorname", "Donatello");
  await formular.fillInput("beklagteNachname", "Cowabunga");
  await formular.fillInput("beklagteStrasseHausnummer", "Schildkrötenstraße 5");
  await formular.fillInput("beklagtePlz", "10119");
  await formular.fillInput("beklagteOrt", "Mutant Mayhem");
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/forderung/gesamtbetrag
  await formular.fillInput("forderungGesamtbetrag", "100.00");
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/sachverhalt/begruendung
  await formular.fillInput("sachverhaltBegruendung", "some reason");
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/beweise/angebot
  await formular.fillRadioPage("beweiseAngebot", "yes");

  // /geld-einklagen/formular/klage-erstellen/beweise/beschreibung
  await formular.fillInput("beweiseBeschreibung", "some description");
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/rechtsproblem/intro/start
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/prozessfuehrung/prozesszinsen
  await formular.fillRadioPage("prozesszinsen", "yes");

  // /geld-einklagen/formular/klage-erstellen/prozessfuehrung/anwaltskosten
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/prozessfuehrung/streitbeilegung
  await formular.fillRadioPage("streitbeilegung", "yes");

  // /geld-einklagen/formular/klage-erstellen/muendliche-verhandlung
  await formular.fillRadioPage("muendlicheVerhandlung", "yes");

  // /geld-einklagen/formular/klage-erstellen/videoverhandlung
  await formular.fillRadioPage("videoVerhandlung", "yes");

  // /geld-einklagen/formular/klage-erstellen/versaeumnisurteil
  await formular.fillRadioPage("versaeumnisurteil", "yes");

  // /geld-einklagen/formular/klage-erstellen/prozessfuehrung/zahlung-nach-klageeinreichung
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/rechtlicher-zusatz/weitere-antraege
  await formular.clickNext();

  // /geld-einklagen/formular/klage-erstellen/rechtlicher-zusatz/rechtliche-wuerdigung
  await formular.clickNext();
}
