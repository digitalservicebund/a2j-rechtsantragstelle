import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_BERLIN_PILOT_COURT = "10823";
const ZIP_CODE_EDGE_CASE_SECONDARY = "04103"; // Leipzig zip code
const ZIP_CODE_HAMBURG_PILOT_COURT = "20095";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  fuerWenKlagen: "selbst",
  sachgebiet: "verkehrsunfall",
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

export const testCasesWithUserInputGerichtSuchenVerkehrsunfall: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    gerichtSuchenVerkehrsunfallGerichtsstandsvereinbarungYes: [
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        userInput: {
          ...baseContext,
          verkehrsunfallStrassenverkehr: "yes",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "yes",
          postleitzahlSecondary: ZIP_CODE_BERLIN_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
      },
    ],
    gerichtSuchenVerkehrsunfallGerichtsstandsvereinbarungNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          verkehrsunfallStrassenverkehr: "yes",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenVerkehrsunfallKlagenKaufmannYesBeklagtePersonNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          verkehrsunfallStrassenverkehr: "yes",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenVerkehrsunfallKlagenKaufmannNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          verkehrsunfallStrassenverkehr: "yes",
          klagendeKaufmann: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenVerkehrsunfallStrassenverkehrNoGerichtsstandsvereinbarungYes: [
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        userInput: {
          ...baseContext,
          verkehrsunfallStrassenverkehr: "no",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "yes",
          postleitzahlSecondary: ZIP_CODE_BERLIN_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
      },
    ],
    gerichtSuchenVerkehrsunfallStrassenverkehrNoGerichtsstandsvereinbarungNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          verkehrsunfallStrassenverkehr: "no",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
      },
    ],
    gerichtSuchenVerkehrsunfallStrassenverkehrNoKlagenKaufmannYesBeklagtePersonNo:
      [
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
          userInput: {
            ...baseContext,
            verkehrsunfallStrassenverkehr: "no",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "no",
            postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
          },
          skipPageSchemaValidation: true,
        },
        {
          stepId:
            "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
        },
      ],
    gerichtSuchenVerkehrsunfallStrassenverkehrNoKlagenKaufmannNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          verkehrsunfallStrassenverkehr: "no",
          klagendeKaufmann: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
      },
    ],
    gerichtSuchenVerkehrsunfallStrassenverkehr: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          verkehrsunfallStrassenverkehr: "yes",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_HAMBURG_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
        userInput: {
          strasseBeklagte: "Teststrasse",
          strasseNummerBeklagte: "1",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
      },
    ],
  };
