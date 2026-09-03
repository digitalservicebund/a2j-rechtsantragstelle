import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "10823";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  fuerWenKlagen: "selbst",
  sachgebiet: "miete",
  gegenWenBeklagen: "person",
  mietePachtVertrag: "yes",
  mietePachtRaum: "yes",
  postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
  beklagteStrasse: "beklagteStrasse",
  beklagteHausnummer: "1",
  beklagtePlz: ZIP_CODE_PILOT_COURT,
  beklagteOrt: "beklagteOrt",
  klagendePersonAnrede: "none",
  klagendePersonTitle: "none",
  klagendePersonVorname: "klagendePersonVorname",
  klagendePersonNachname: "klagendePersonNachname",
  klagendePersonStrasse: "klagendePersonStrasse",
  klagendePersonHausnummer: "1",
  klagendePersonPlz: ZIP_CODE_PILOT_COURT,
  klagendePersonOrt: "klagendePersonOrt",
  beklagteAnrede: "none",
  beklagteTitle: "none",
  beklagteVorname: "beklagteVorname",
  beklagteNachname: "beklagteNachname",
  forderungGesamtbetrag: "1000",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/sachgebiet": true,
      "/gericht-pruefen/klagende-person": true,
      "/gericht-pruefen/beklagte-person": true,
      "/gericht-pruefen/gericht-suchen": true,
      "/klage-erstellen/klagende-person": true,
      "/klage-erstellen/beklagte-person": true,
      "/klage-erstellen/forderung": true,
      "/klage-erstellen/sachverhalt": true,
      "/klage-erstellen/prozessfuehrung": true,
    },
  },
};

export const testCasesWithUserInputKlagenErstellenBegruendung: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    withoutAbschnitt: [
      {
        stepId: "/klage-erstellen/begruendung/einfuehrung/start",
        userInput: {
          ...baseContext,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/klage-erstellen/begruendung/beschreibung/uebersicht",
      },
      {
        stepId: "/klage-erstellen/begruendung/beschreibung/warnung",
      },
    ],
    withAbschnitt: [
      {
        stepId: "/klage-erstellen/begruendung/einfuehrung/start",
        userInput: {
          ...baseContext,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/klage-erstellen/begruendung/beschreibung/uebersicht",
        addArrayItemEvent: "add-beschreibung",
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/klage-erstellen/begruendung/beschreibung/abschnitte/0/daten",
        userInput: {
          "abschnitte#beschreibung": "Abschnitt 1",
        },
      },
      {
        stepId: "/klage-erstellen/begruendung/beschreibung/uebersicht",
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/anwaltskosten",
      },
    ],
  };
