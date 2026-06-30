import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_EDGE_CASE = "20359"; // AG Hamburg zip code
const ZIP_CODE_EDGE_CASE_SECONDARY = "28237"; // AG Bremen zip code
const STREET_EDGE_CASE = "Talstr.";
const STREET_HOUSE_NUMBER_EDGE_CASE = "5";
const STREET_EDGE_CASE_SECONDARY = "Altenescher Str.";
const STREET_HOUSE_NUMBER_EDGE_CASE_SECONDARY = "12";

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

export const testCasesWithUserInputGerichtSuchenEdgeCases: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    gerichtSuchenEdgeCasesMieteVertragAndRaumYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
        userInput: {
          ...baseContext,
          mietePachtVertrag: "yes",
          mietePachtRaum: "yes",
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/strasse-nummer",
        userInput: {
          strasseSekundaer: STREET_EDGE_CASE,
          strasseNummerSekundaer: STREET_HOUSE_NUMBER_EDGE_CASE,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenEdgeCasesMieteGerichtsstandsvereinbarungYes: [
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "no",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "yes",
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/strasse-nummer",
        userInput: {
          strasseSekundaer: STREET_EDGE_CASE,
          strasseNummerSekundaer: STREET_HOUSE_NUMBER_EDGE_CASE,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenEdgeCasesMieteVerbraucherHaustuergeschaeftYes: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "no",
          klagendeVerbraucher: "yes",
          klagendeHaustuergeschaeft: "yes",
          postleitzahlBeklagtePerson: ZIP_CODE_EDGE_CASE,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
        userInput: {
          strasseBeklagte: STREET_EDGE_CASE,
          strasseNummerBeklagte: STREET_HOUSE_NUMBER_EDGE_CASE,
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/strasse-nummer",
        userInput: {
          strasseSekundaer: STREET_EDGE_CASE_SECONDARY,
          strasseNummerSekundaer: STREET_HOUSE_NUMBER_EDGE_CASE_SECONDARY,
        },
      },

      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
      },
    ],
    gerichtSuchenEdgeCasesMietenKlagendeHaustuergeschaeftNo: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "no",
          klagendeVerbraucher: "yes",
          klagendeHaustuergeschaeft: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_EDGE_CASE,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
        userInput: {
          strasseBeklagte: STREET_EDGE_CASE,
          strasseNummerBeklagte: STREET_HOUSE_NUMBER_EDGE_CASE,
        },
      },
      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      },
    ],
    gerichtSuchenEdgeCasesSchaden: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "schaden",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_EDGE_CASE,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
        userInput: {
          strasseBeklagte: STREET_EDGE_CASE,
          strasseNummerBeklagte: STREET_HOUSE_NUMBER_EDGE_CASE,
        },
      },
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-unerlaubte-person",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/strasse-nummer",
        userInput: {
          strasseSekundaer: STREET_EDGE_CASE,
          strasseNummerSekundaer: STREET_HOUSE_NUMBER_EDGE_CASE,
        },
      },

      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
      },
    ],
    gerichtSuchenEdgeCasesVerkehrsunfall: [
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        userInput: {
          ...baseContext,
          sachgebiet: "verkehrsunfall",
          verkehrsunfallStrassenverkehr: "yes",
          klagendeKaufmann: "yes",
          beklagtePersonKaufmann: "yes",
          gerichtsstandsvereinbarung: "no",
          postleitzahlBeklagtePerson: ZIP_CODE_EDGE_CASE,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
        userInput: {
          strasseBeklagte: STREET_EDGE_CASE,
          strasseNummerBeklagte: STREET_HOUSE_NUMBER_EDGE_CASE,
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
        userInput: {
          postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/strasse-nummer",
        userInput: {
          strasseSekundaer: STREET_EDGE_CASE,
          strasseNummerSekundaer: STREET_HOUSE_NUMBER_EDGE_CASE,
        },
      },

      {
        stepId: "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
      },
    ],
  };
