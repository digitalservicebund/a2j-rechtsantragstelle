import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";

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
  beklagteAnrede: "none",
  beklagteTitle: "",
  beklagteVorname: "beklagteVorname",
  beklagteNachname: "beklagteNachname",
  prozesszinsen: "yes",
  anwaltskosten: "10",
  streitbeilegung: "yes",
  streitbeilegungGruende: "yes",
  muendlicheVerhandlung: "yes",
  videoVerhandlung: "no",
  versaeumnisurteil: "yes",
};

export const testCasesKlageErstellenRechtlicherZusatz = [
  [
    {
      ...baseContext,
      weitereAntraege: "Ich habe noch weitere Anträge.",
      rechtlicheWuerdigung: "Hiermit begründe ich meine Klage wie folgt...",
    },
    [
      "/klage-erstellen/rechtlicher-zusatz/weitere-antraege",
      "/klage-erstellen/rechtlicher-zusatz/rechtliche-wuerdigung",
      "/klage-herunterladen/intro/start",
    ],
  ],
  [
    {
      ...baseContext,
      weitereAntraege: "",
      rechtlicheWuerdigung: "",
    },
    [
      "/klage-erstellen/rechtlicher-zusatz/weitere-antraege",
      "/klage-erstellen/rechtlicher-zusatz/rechtliche-wuerdigung",
      "/klage-herunterladen/intro/start",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
