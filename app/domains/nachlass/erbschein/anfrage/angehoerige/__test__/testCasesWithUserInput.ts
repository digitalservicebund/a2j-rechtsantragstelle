import {
  type ExpectedStep,
  type FlowTestCases,
} from "~/domains/__test__/TestCases";
import { nachlassErbscheinAnfrageHappyPathData } from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type Angehoerige } from "~/domains/nachlass/erbschein/anfrage/angehoerige/pages";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { type Kind } from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";

const happyPathData: NachlassErbscheinAnfrageUserData = {
  ...nachlassErbscheinAnfrageHappyPathData,
  testamentArt: "none",
  verstorbeneFamilienstand: "ledig",
};

const validAngehoerige = [
  {
    vorname: "Max",
    nachname: "Mustermann",
    geburtsdatum: { day: "01", month: "01", year: "1990" },
    geburtsort: "Musterstadt",
    isAlive: "no",
    sterbedatum: { day: "01", month: "01", year: "2020" },
    sterbeort: "Musterstadt",
  } satisfies Angehoerige,
];

/**
 * To ensure Angehörige is reachable, both generations related to the Erblasser must be
 * entirely deceased, triggering a "3rd Order" inheritance scenario,
 * not handled by the flow, but instead handled by the "Angehörige" section.
 */
const dataToReachAngehoerige: NachlassErbscheinAnfrageUserData = {
  ...happyPathData,
  hatteKinder: "yes",
  kinder: [
    {
      ...validAngehoerige[0],
      hatteKinder: "no",
    },
  ],
  elternteile: [
    {
      ...validAngehoerige[0],
      hatteKinder: "no",
    },
  ],
};

const depthFiveDeadKind = () => {
  let kind: Extract<Kind, { isAlive: "no"; hatteKinder: "yes" }> = {
    ...validAngehoerige[0],
    hatteKinder: "yes" as const,
  };
  for (let depth = 1; depth < 5; depth++) {
    kind = { ...kind, kinder: [kind] };
  }
  return kind;
};

const deceasedAngehoerigeToGrundbesitz = (
  startingData?: NachlassErbscheinAnfrageUserData,
): Array<ExpectedStep<NachlassErbscheinAnfrageUserData>> => [
  {
    stepId: "/angehoerige/uebersicht",
    addArrayItemEvent: "add-angehoerige",
    userInput: startingData,
  },
  {
    stepId: "/angehoerige/#/name",
    userInput: {
      ...happyPathData,
      "angehoerige#vorname": "Max",
      "angehoerige#nachname": "Mustermann",
    },
  },
  {
    stepId: "/angehoerige/#/geburtsdatum",
    userInput: {
      "angehoerige#geburtsdatum": validAngehoerige[0].geburtsdatum,
      "angehoerige#geburtsort": "Musterstadt",
    },
  },
  {
    stepId: "/angehoerige/#/lebend",
    userInput: {
      "angehoerige#isAlive": "no",
    },
  },
  {
    stepId: "/angehoerige/#/sterbedatum",
    userInput: {
      "angehoerige#sterbedatum": validAngehoerige[0].sterbedatum,
      "angehoerige#sterbeort": "Musterstadt",
    },
  },
  {
    stepId: "/angehoerige/uebersicht",
    skipPageSchemaValidation: true,
    userInput: { angehoerige: validAngehoerige },
  },
  {
    stepId: "/nachlass/grundbesitz/grundbesitz-frage",
  },
];

export const angehoerigeTestCases = {
  kinderToAngehoerige: [
    {
      stepId: "/angehoerige/kinder",
      skipPageSchemaValidation: true,
      userInput: {
        ...happyPathData,
        hatteKinder: "yes",
        kinder: [depthFiveDeadKind()],
      },
    },
    ...deceasedAngehoerigeToGrundbesitz(),
  ],
  elternteileToAngehoerige: [
    {
      stepId: "/angehoerige/elternteile",
      skipPageSchemaValidation: true,
      userInput: {
        ...happyPathData,
        hatteKinder: "yes",
        kinder: [],
        elternteile: [
          {
            ...validAngehoerige[0],
            hatteKinder: "no",
          },
        ],
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
  kinderToElternteileToAngehoerige: [
    {
      stepId: "/angehoerige/kinder",
      skipPageSchemaValidation: true,
      userInput: {
        ...happyPathData,
        hatteKinder: "yes",
        kinder: [
          {
            ...validAngehoerige[0],
            hatteKinder: "no",
          },
        ],
        elternteile: [
          {
            ...validAngehoerige[0],
            hatteKinder: "no",
          },
        ],
      },
    },
    {
      stepId: "/angehoerige/elternteile",
    },
    ...deceasedAngehoerigeToGrundbesitz(),
  ],
  noAngehoerigeEntered: [
    {
      stepId: "/angehoerige/uebersicht",
      skipPageSchemaValidation: true,
      userInput: dataToReachAngehoerige,
    },
    {
      stepId: "/angehoerige/warnung",
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
  deceasedAngehoerige: [
    ...deceasedAngehoerigeToGrundbesitz(dataToReachAngehoerige),
  ],
  survivingAngehoerige: [
    {
      stepId: "/angehoerige/uebersicht",
      addArrayItemEvent: "add-angehoerige",
      userInput: dataToReachAngehoerige,
    },
    {
      stepId: "/angehoerige/#/name",
      userInput: {
        "angehoerige#vorname": "Max",
        "angehoerige#nachname": "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/#/geburtsdatum",
      userInput: {
        "angehoerige#geburtsdatum": {
          day: "01",
          month: "01",
          year: "1990",
        },
        "angehoerige#geburtsort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/#/lebend",
      userInput: {
        "angehoerige#isAlive": "yes",
        angehoerige: [
          {
            isAlive: "yes",
          } as any,
        ],
      },
      pageData: {
        arrayIndexes: [0],
      },
    },
    {
      stepId: "/angehoerige/#/anschrift",
      userInput: {
        "angehoerige#strasse": "Musterstraße 1",
        "angehoerige#hausnummer": "1",
        "angehoerige#plz": "12345",
        "angehoerige#ort": "Musterstadt",
        "angehoerige#land": "Deutschland",
      },
    },
    {
      stepId: "/angehoerige/#/verhaeltnis",
      userInput: {
        "angehoerige#verhaeltnis": "cousin",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
} satisfies FlowTestCases<NachlassErbscheinAnfrageUserData>;
