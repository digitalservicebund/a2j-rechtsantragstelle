import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../userData";

const ZIP_CODE_PILOT_COURT = "10823";

const baseContext: GeldEinklagenFormularUserData = {
  forderung: "maximal5000",
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
  klagendePersonTitle: "",
  klagendePersonVorname: "klagendePersonVorname",
  klagendePersonNachname: "klagendePersonNachname",
  klagendePersonStrasseHausnummer: "klagendePersonStrasseHausnummer",
  klagendePersonPlz: ZIP_CODE_PILOT_COURT,
  klagendePersonOrt: "klagendePersonOrt",
};

export const testCasesKlagenErstellenInitial = [
  [
    {
      ...baseContext,
      beklagteAnrede: "none",
      beklagteTitle: "",
      beklagteVorname: "beklagteVorname",
      beklagteNachname: "beklagteNachname",
    },
    [
      "/klage-erstellen/intro/start",
      "/klage-erstellen/streitwert-kosten/gerichtskostenvorschuss",
      "/klage-erstellen/streitwert-kosten/weitere-kosten",
      "/klage-erstellen/klagende-person/kontaktdaten",
      "/klage-erstellen/beklagte-person/mensch",
      "/klage-erstellen/rechtsproblem/intro/start",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
      beklagteNameOrganisation: "beklagteNameOrganisation",
      beklagteGesetzlichenVertretung: "beklagteGesetzlichenVertretung",
    },
    [
      "/klage-erstellen/intro/start",
      "/klage-erstellen/streitwert-kosten/gerichtskostenvorschuss",
      "/klage-erstellen/streitwert-kosten/weitere-kosten",
      "/klage-erstellen/klagende-person/kontaktdaten",
      "/klage-erstellen/beklagte-person/organisation",
      "/klage-erstellen/rechtsproblem/intro/start",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
