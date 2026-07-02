import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "60313"; // AG Frankfurt am Main zip code
const ZIP_CODE_EDGE_CASE_SECONDARY = "04103"; // Leipzig zip code

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  fuerWenKlagen: "selbst",
  sachgebiet: "urheberrecht",
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

export const testCasesWithUserInputGerichtSuchenUrheberrecht: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    gerichtSuchenUrheberrechtGerichtsstandsvereinbarungYes: [
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        userInput: {
          ...baseContext,
          klagendeKaufmann: "yes",
          klagendeVerbraucher: "no",
          beklagtePersonGeldVerdienen: "yes",
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
    gerichtSuchenUrheberrechtGerichtsstandsvereinbarungNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          klagendeKaufmann: "yes",
          beklagtePersonGeldVerdienen: "yes",
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
    gerichtSuchenUrheberrechtKlagenKaufmannYesBeklagtePersonGeldVerdienenYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          klagendeKaufmann: "yes",
          beklagtePersonGeldVerdienen: "yes",
          beklagtePersonKaufmann: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenUrheberrechtBeklagtePersonGeldVerdienenNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          klagendeKaufmann: "yes",
          beklagtePersonGeldVerdienen: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenUrheberrechtKlagenVertragBeklagtePersonGeldVerdienenYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          klagendeVertrag: "yes",
          klagendeHaustuergeschaeft: "yes",
          beklagtePersonGeldVerdienen: "yes",
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
    gerichtSuchenUrheberrechtKlagenVertragBeklagtePersonGeldVerdienenNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          klagendeVertrag: "yes",
          klagendeHaustuergeschaeft: "yes",
          beklagtePersonGeldVerdienen: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenUrheberrechtOrganisationKlagendeKaufmannBeklagteKaufmannYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          gegenWenBeklagen: "organisation",
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
    gerichtSuchenUrheberrechtOrganisationKlagendeKaufmannYesBeklagteKaufmannNo:
      [
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
          userInput: {
            ...baseContext,
            gegenWenBeklagen: "organisation",
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
    gerichtSuchenUrheberrechtOrganisationKlagendeVertragKlagendeHaustuergeschaeftYes:
      [
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
          userInput: {
            ...baseContext,
            gegenWenBeklagen: "organisation",
            klagendeVertrag: "yes",
            klagendeHaustuergeschaeft: "yes",
            postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
          },
          skipPageSchemaValidation: true,
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
          userInput: {
            postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
          },
        },
        {
          stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
        },
      ],
    gerichtSuchenUrheberrechtOrganisationKlagendeVertragYesKlagendeHaustuergeschaeftNo:
      [
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
          userInput: {
            ...baseContext,
            gegenWenBeklagen: "organisation",
            klagendeVertrag: "yes",
            klagendeHaustuergeschaeft: "no",
            postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
          },
          skipPageSchemaValidation: true,
        },
        {
          stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
        },
      ],
    gerichtSuchenUrheberrechtKonzentrierenTest: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          klagendeKaufmann: "yes",
          beklagtePersonGeldVerdienen: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "no",
          postleitzahlBeklagtePerson: "10115", // Berlin AG Miete zip code NON-PILOT
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
      },
    ],
  };
