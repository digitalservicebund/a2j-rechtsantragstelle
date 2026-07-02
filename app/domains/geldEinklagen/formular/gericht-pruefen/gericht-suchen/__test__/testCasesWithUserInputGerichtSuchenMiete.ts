import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "10823";
const ZIP_CODE_EDGE_CASE_SECONDARY = "04103"; // Leipzig zip code

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  fuerWenKlagen: "selbst",
  sachgebiet: "miete",
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

export const testCasesWithUserInputGerichtSuchenMiete: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    gerichtSuchenMieteVertragAndRaumYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
        userInput: {
          ...baseContext,
          mietePachtVertrag: "yes",
          mietePachtRaum: "yes",
          postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenMieteKlagenVerbraucherHaustuergeschaeftYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
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
      },
    ],
    gerichtSuchenMieteKlagenVerbraucherYesHaustuergeschaeftNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
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
    ],
    gerichtSuchenMieteKlagenKaufmannYesBeklagtePersonYes: [
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        userInput: {
          ...baseContext,
          mietePachtVertrag: "no",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "yes",
          postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenMieteKlagenKaufmannYesBeklagtePersonNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          mietePachtVertrag: "no",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenMieteVertragNoKlagenKaufmannYesBeklagtePersonNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          mietePachtVertrag: "no",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenMieteVertragNoKlagenKaufmannNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          mietePachtVertrag: "no",
          klagendeKaufmann: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
  };
