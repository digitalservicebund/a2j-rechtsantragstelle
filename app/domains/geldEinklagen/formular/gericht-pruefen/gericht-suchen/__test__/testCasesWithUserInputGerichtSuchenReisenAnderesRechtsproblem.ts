import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "10823";
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

export const testCasesWithUserInputGerichtSuchenReisenAnderesRechtsproblem: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    gerichtSuchenReisenGerichtsstandsvereinbarungYes: [
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        userInput: {
          ...baseContext,
          sachgebiet: "reisen",
          klagendeVerbraucher: "no",
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
    gerichtSuchenReisenGerichtsstandsvereinbarungNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "reisen",
          klagendeVerbraucher: "no",
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
    gerichtSuchenReisenKlagenKaufmannYesBeklagtePersonNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "reisen",
          klagendeVerbraucher: "no",
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
    gerichtSuchenReisenKlagenKaufmannNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "reisen",
          klagendeVerbraucher: "yes",
          klagendeKaufmann: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenReisenKlagendeVertragKlagendeHaustuergeschaeftYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "reisen",
          klagendeVerbraucher: "yes",
          klagendeVertrag: "yes",
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
    gerichtSuchenReisenKlagendeVertragYesKlagendeHaustuergeschaeftNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "reisen",
          klagendeVerbraucher: "yes",
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
    gerichtSuchenAnderesRechtsproblemGerichtsstandsvereinbarungYes: [
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        userInput: {
          ...baseContext,
          sachgebiet: "anderesRechtsproblem",
          klagendeVerbraucher: "no",
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
    gerichtSuchenAnderesRechtsproblemGerichtsstandsvereinbarungNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "anderesRechtsproblem",
          klagendeVerbraucher: "no",
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
    gerichtSuchenAnderesRechtsproblemKlagenKaufmannYesBeklagtePersonNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "anderesRechtsproblem",
          klagendeVerbraucher: "no",
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
    gerichtSuchenAnderesRechtsproblemKlagenKaufmannNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "anderesRechtsproblem",
          klagendeVerbraucher: "yes",
          klagendeKaufmann: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenAnderesRechtsproblemKlagendeVertragKlagendeHaustuergeschaeftYes:
      [
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
          userInput: {
            ...baseContext,
            sachgebiet: "anderesRechtsproblem",
            klagendeVerbraucher: "yes",
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
    gerichtSuchenAnderesRechtsproblemKlagendeVertragYesKlagendeHaustuergeschaeftNo:
      [
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
          userInput: {
            ...baseContext,
            sachgebiet: "anderesRechtsproblem",
            klagendeVerbraucher: "yes",
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
  };
