import type { ExpectedStep, FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/sachgebiet": true,
      "/gericht-pruefen/klagende-person": true,
    },
  },
};

const initialDefaultStep = (
  userInputStepData: GeldEinklagenFormularUserData,
): Array<ExpectedStep<GeldEinklagenFormularUserData>> => [
  {
    stepId: "/gericht-pruefen/klagende-person/fuer-wen",
    userInput: {
      ...baseContext,
      ...userInputStepData,
    },
    skipPageSchemaValidation: true,
  },
];

export const testCasesWithUserInputKlagendePerson: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    klagendePersonOrganisation: [
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
        userInput: {
          ...baseContext,
          fuerWenKlagen: "organisation",
        },
      },
      {
        stepId:
          "/gericht-pruefen/klagende-person/ergebnis/organisation-abbruch",
      },
    ],
    klagendePersonWithMieteVertragAndRaumYes: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "miete",
        mietePachtVertrag: "yes",
        mietePachtRaum: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithMieteVertragYesAndRaumNoAndKlagendeVerbraucherNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "miete",
        mietePachtVertrag: "yes",
        mietePachtRaum: "no",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithMieteVertragYesAndRaumNoAndKlagendeVerbraucherYes: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "miete",
        mietePachtVertrag: "yes",
        mietePachtRaum: "no",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/haustuergeschaeft",
        userInput: {
          klagendeHaustuergeschaeft: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithMieteVertragNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "miete",
        mietePachtVertrag: "no",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithReisenAndVerbraucherNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "reisen",
        reiseArt: "flug",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithReisenAndVerbraucherYesAndVertragNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "reisen",
        reiseArt: "flug",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/vertrag",
        userInput: {
          klagendeVertrag: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithReisenAndVerbraucherYesAndVertragYes: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "reisen",
        reiseArt: "flug",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/vertrag",
        userInput: {
          klagendeVertrag: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/haustuergeschaeft",
        userInput: {
          klagendeHaustuergeschaeft: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithAnderesRechtsproblemAndVerbraucherNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "anderesRechtsproblem",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithAnderesRechtsproblemAndVerbraucherYesAndVertragNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "anderesRechtsproblem",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/vertrag",
        userInput: {
          klagendeVertrag: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithAnderesRechtsproblemAndVerbraucherYesAndVertragYes: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "anderesRechtsproblem",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/vertrag",
        userInput: {
          klagendeVertrag: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/haustuergeschaeft",
        userInput: {
          klagendeHaustuergeschaeft: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithUrheberrechtAndVerbraucherNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "urheberrecht",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithUrheberrechtAndVerbraucherYesAndVertragNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "urheberrecht",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/vertrag",
        userInput: {
          klagendeVertrag: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithUrheberrechtAndVerbraucherYesAndVertragYes: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "urheberrecht",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/verbraucher",
        userInput: {
          klagendeVerbraucher: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/vertrag",
        userInput: {
          klagendeVertrag: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/haustuergeschaeft",
        userInput: {
          klagendeHaustuergeschaeft: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithSchadenKaufmannYes: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "schaden",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithSchadenKaufmannNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "schaden",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithVerkehrsunfallKaufmannYes: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "verkehrsunfall",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithVerkehrsunfallKaufmannNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "verkehrsunfall",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithVersicherungKaufmannYes: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "versicherung",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
    klagendePersonWithVersicherungKaufmannNo: [
      ...initialDefaultStep({
        fuerWenKlagen: "selbst",
        sachgebiet: "versicherung",
      }),
      {
        stepId: "/gericht-pruefen/klagende-person/kaufmann",
        userInput: {
          klagendeKaufmann: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
      },
    ],
  };
