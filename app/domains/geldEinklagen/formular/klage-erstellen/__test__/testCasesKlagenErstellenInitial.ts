import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../userData";

const ZIP_CODE_PILOT_COURT = "10823";

const baseContext: GeldEinklagenFormularUserData = {
  forderung: "maximal10000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  sachgebiet: "miete",
  gegenWenBeklagen: "person",
  mietePachtVertrag: "yes",
  mietePachtRaum: "yes",
  postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
  beklagteStrasseHausnummer: "beklagteStrasseHausnummer",
  beklagtePlz: ZIP_CODE_PILOT_COURT,
  beklagteOrt: "beklagteOrt",
  klagendePersonAnrede: "none",
  klagendePersonTitle: "none",
  klagendePersonVorname: "klagendePersonVorname",
  klagendePersonNachname: "klagendePersonNachname",
  klagendePersonStrasseHausnummer: "klagendePersonStrasseHausnummer",
  klagendePersonPlz: ZIP_CODE_PILOT_COURT,
  klagendePersonOrt: "klagendePersonOrt",
  forderungGesamtbetrag: "100.00",
  sachverhaltBegruendung: "some reason",
};

export const testCasesKlagenErstellenInitial = [
  [
    {
      ...baseContext,
      beklagteAnrede: "none",
      beklagteTitle: "none",
      beklagteVorname: "beklagteVorname",
      beklagteNachname: "beklagteNachname",
      beweiseAngebot: "yes",
      beweiseBeschreibung: "some description",
    },
    [
      "/klage-erstellen/intro/start",
      "/klage-erstellen/streitwert-kosten/gerichtskostenvorschuss",
      "/klage-erstellen/streitwert-kosten/weitere-kosten",
      "/klage-erstellen/klagende-person/kontaktdaten",
      "/klage-erstellen/beklagte-person/mensch",
      "/klage-erstellen/forderung/gesamtbetrag",
      "/klage-erstellen/sachverhalt/begruendung",
      "/klage-erstellen/beweise/angebot",
      "/klage-erstellen/beweise/beschreibung",
      "/klage-erstellen/prozessfuehrung/prozesszinsen",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
      beklagteNameOrganisation: "beklagteNameOrganisation",
      beklagteGesetzlichenVertretungVorname:
        "beklagteGesetzlichenVertretungVorname",
      beklagteGesetzlichenVertretungNachname:
        "beklagteGesetzlichenVertretungNachname",
      beklagteGesetzlichenVertretungAnrede: "herr",
      beklagteGesetzlichenVertretungTitle: "dr",
      beweiseAngebot: "yes",
      beweiseBeschreibung: "some description",
    },
    [
      "/klage-erstellen/intro/start",
      "/klage-erstellen/streitwert-kosten/gerichtskostenvorschuss",
      "/klage-erstellen/streitwert-kosten/weitere-kosten",
      "/klage-erstellen/klagende-person/kontaktdaten",
      "/klage-erstellen/beklagte-person/organisation",
      "/klage-erstellen/forderung/gesamtbetrag",
      "/klage-erstellen/sachverhalt/begruendung",
      "/klage-erstellen/beweise/angebot",
      "/klage-erstellen/beweise/beschreibung",
      "/klage-erstellen/prozessfuehrung/prozesszinsen",
    ],
  ],
  [
    {
      ...baseContext,
      beklagteAnrede: "none",
      beklagteTitle: "none",
      beklagteVorname: "beklagteVorname",
      beklagteNachname: "beklagteNachname",
      beweiseAngebot: "no",
    },
    [
      "/klage-erstellen/intro/start",
      "/klage-erstellen/streitwert-kosten/gerichtskostenvorschuss",
      "/klage-erstellen/streitwert-kosten/weitere-kosten",
      "/klage-erstellen/klagende-person/kontaktdaten",
      "/klage-erstellen/beklagte-person/mensch",
      "/klage-erstellen/forderung/gesamtbetrag",
      "/klage-erstellen/sachverhalt/begruendung",
      "/klage-erstellen/beweise/angebot",
      "/klage-erstellen/prozessfuehrung/prozesszinsen",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
      beklagteNameOrganisation: "beklagteNameOrganisation",
      beklagteGesetzlichenVertretungVorname:
        "beklagteGesetzlichenVertretungVorname",
      beklagteGesetzlichenVertretungNachname:
        "beklagteGesetzlichenVertretungNachname",
      beklagteGesetzlichenVertretungAnrede: "herr",
      beklagteGesetzlichenVertretungTitle: "dr",
      beweiseAngebot: "no",
    },
    [
      "/klage-erstellen/intro/start",
      "/klage-erstellen/streitwert-kosten/gerichtskostenvorschuss",
      "/klage-erstellen/streitwert-kosten/weitere-kosten",
      "/klage-erstellen/klagende-person/kontaktdaten",
      "/klage-erstellen/beklagte-person/organisation",
      "/klage-erstellen/forderung/gesamtbetrag",
      "/klage-erstellen/sachverhalt/begruendung",
      "/klage-erstellen/beweise/angebot",
      "/klage-erstellen/prozessfuehrung/prozesszinsen",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
