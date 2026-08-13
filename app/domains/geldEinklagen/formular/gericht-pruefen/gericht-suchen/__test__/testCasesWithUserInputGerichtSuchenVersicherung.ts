import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "10823";
const ZIP_CODE_EDGE_CASE_SECONDARY = "04103"; // Leipzig zip code

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  fuerWenKlagen: "selbst",
  sachgebiet: "versicherung",
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

export const testCasesWithUserInputGerichtSuchenVersicherung: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    gerichtSuchenVersicherungGerichtsstandsvereinbarungYes: [
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        userInput: {
          ...baseContext,
          versicherungVertrag: "yes",
          versicherungsnehmer: "yes",
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
    gerichtSuchenVersicherungGerichtsstandsvereinbarungNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          versicherungVertrag: "yes",
          versicherungsnehmer: "yes",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "no",
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
    gerichtSuchenVersicherungKlagenKaufmannYesBeklagtePersonNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          versicherungVertrag: "yes",
          versicherungsnehmer: "yes",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "no",
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
    gerichtSuchenVersicherungKlagenKaufmannNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          versicherungVertrag: "yes",
          versicherungsnehmer: "yes",
          klagendeKaufmann: "no",
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
    gerichtSuchenVersicherungVersicherungsnehmerNoBeklagtePersonKaufmannYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          versicherungVertrag: "yes",
          versicherungsnehmer: "no",
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
    gerichtSuchenVersicherungVersicherungsnehmerBeklagtePersonKaufmannNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          versicherungVertrag: "yes",
          versicherungsnehmer: "no",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "no",
          gerichtsstandsvereinbarung: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenVersicherungVersicherungsnehmerKlagendePersonKaufmannNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          versicherungVertrag: "yes",
          versicherungsnehmer: "no",
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
