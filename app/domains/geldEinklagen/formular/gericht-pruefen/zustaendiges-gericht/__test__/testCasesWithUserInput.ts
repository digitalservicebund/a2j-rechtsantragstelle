import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "10823";
const ZIP_CODE_NON_PILOT_COURT = "10115";
const ZIP_CODE_EDGE_CASE_SECONDARY = "04103"; // Leipzig zip code

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  fuerWenKlagen: "selbst",
  gegenWenBeklagen: "person",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/sachgebiet": true,
      "/gericht-pruefen/klagende-person": true,
      "/gericht-pruefen/beklagte-person": true,
      "/gericht-pruefen/gericht-suchen": true,
    },
  },
};

export const testCasesWithUserInputZustaendigesGericht: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    zustaendigesGerichtMieteAndVertragAndRaumeYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "yes",
          postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
      {
        stepId: "/klage-erstellen/intro/start",
      },
    ],
    zustaendigesGerichtMieteAndVerbraucherYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "no",
          klagendeVerbraucher: "yes",
          klagendeHaustuergeschaeft: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
      {
        stepId: "/klage-erstellen/intro/start",
      },
    ],
    zustaendigesGerichtMieteAndVertragAndRaumeYesNonPilotCourt: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "yes",
          postleitzahlSecondary: ZIP_CODE_NON_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
      },
    ],
    zustaendigesGerichtMieteAndVerbraucherYesNonPilotCourt: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "no",
          klagendeVerbraucher: "yes",
          klagendeHaustuergeschaeft: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_NON_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
      },
    ],
    zustaendigesGerichtMieteAndVerbraucherYesSamePilotCourts: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "no",
          klagendeVerbraucher: "yes",
          klagendeHaustuergeschaeft: "yes",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
        userInput: {
          pilotGerichtAuswahl: "sekundaerCourt",
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
      {
        stepId: "/klage-erstellen/intro/start",
      },
    ],
    zustaendigesGerichtMieteAndVerbraucherYesSameNonPilotCourts: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "no",
          klagendeVerbraucher: "yes",
          klagendeHaustuergeschaeft: "yes",
          postleitzahlBeklagtePerson: ZIP_CODE_NON_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_NON_PILOT_COURT,
        },
      },
      {
        stepId:
          "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
      },
    ],
    zustaendigesGerichtMieteAndVerbraucherYesBeklagtePilotCourt: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "no",
          klagendeVerbraucher: "yes",
          klagendeHaustuergeschaeft: "yes",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_NON_PILOT_COURT,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
      {
        stepId: "/klage-erstellen/intro/start",
      },
    ],
    zustaendigesGerichtMieteAndVerbraucherYesSecondaryPilotCourt: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "no",
          klagendeVerbraucher: "yes",
          klagendeHaustuergeschaeft: "yes",
          postleitzahlBeklagtePerson: ZIP_CODE_NON_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
      {
        stepId: "/klage-erstellen/intro/start",
      },
    ],
  };
