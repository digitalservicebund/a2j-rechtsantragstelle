import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "10823";
const ZIP_CODE_EDGE_CASE_SECONDARY = "04103"; // Leipzig zip code

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  fuerWenKlagen: "selbst",
  sachgebiet: "schaden",
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

export const testCasesWithUserInputGerichtSuchenSchaden: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    gerichtSuchenSchadenKlagenKaufmannBeklagtePersonGerichtsstandsvereinbarungYes:
      [
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
          userInput: {
            ...baseContext,
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
    gerichtSuchenSchadenKlagenKaufmannBeklagtePersonGerichtsstandsvereinbarungNo:
      [
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
          userInput: {
            ...baseContext,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
            gerichtsstandsvereinbarung: "no",
            postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
          },
          skipPageSchemaValidation: true,
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-unerlaubte-person",
          userInput: {
            postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
          },
        },
        {
          stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
        },
      ],
    gerichtSuchenSchadenKlagenKaufmannYesBeklagtePersonNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-unerlaubte-person",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
      },
    ],
    gerichtSuchenSchadenKlagenKaufmannNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          klagendeKaufmann: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-unerlaubte-person",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
      },
    ],
  };
