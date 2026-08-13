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
  sachverhaltBegruendung: "some reason",
  beweiseAngebot: "no",
  forderungGesamtbetrag: "1000",
  anwaltskosten: "10",
  prozesszinsen: "yes",
  streitbeilegung: "yes",
  muendlicheVerhandlung: "yes",
  videoVerhandlung: "no",
  versaeumnisurteil: "yes",
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

export const testCasesWithUserInputKlagenErstellenRechtlicherZusatz: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    klageErstellenRechtlicherZusatzWithAnwaltschaftNo: [
      {
        stepId: "/klage-erstellen/rechtlicher-zusatz/weitere-antraege",
        userInput: {
          ...baseContext,
          weitereAntraege: "Ich habe noch weitere Anträge.",
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/klage-erstellen/rechtlicher-zusatz/rechtliche-wuerdigung",
        userInput: {
          rechtlicheWuerdigung: "Hiermit begründe ich meine Klage wie folgt...",
        },
      },
      {
        stepId: "/klage-erstellen/zusammenfassung/uebersicht",
      },
      {
        stepId: "/klage-herunterladen/intro/start",
      },
    ],
    klageErstellenRechtlicherZusatzWithAnwaltschaftYes: [
      {
        stepId: "/klage-erstellen/rechtlicher-zusatz/weitere-antraege",
        userInput: {
          ...baseContext,
          anwaltschaft: "yes",
          weitereAntraege: "Ich habe noch weitere Anträge.",
          klagendePersonAnwaltschaftStrasse:
            "klagendePersonAnwaltschaftStrasse",
          klagendePersonAnwaltschaftHausnummer: "1",
          klagendePersonAnwaltschaftPlz: ZIP_CODE_PILOT_COURT,
          klagendePersonAnwaltschaftOrt: "klagendePersonAnwaltschaftOrt",
          klagendePersonAnwaltschaftAnrede: "none",
          klagendePersonAnwaltschaftVorname:
            "klagendePersonAnwaltschaftVorname",
          klagendePersonAnwaltschaftNachname:
            "klagendePersonAnwaltschaftNachname",
          klagendePersonAnwaltschaftTitle: "none",
          klagendePersonAnwaltschaftEmail: "",
          klagendePersonAnwaltschaftTelefonnummer: "",
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/klage-erstellen/rechtlicher-zusatz/rechtliche-wuerdigung",
        userInput: {
          rechtlicheWuerdigung: "Hiermit begründe ich meine Klage wie folgt...",
        },
      },
      {
        stepId: "/klage-erstellen/zusammenfassung/uebersicht",
      },
      {
        stepId: "/klage-herunterladen/intro/start-anwaltschaft",
      },
    ],
  };
