// oxlint-disable-next-line no-unused-vars
import type { FlowTestCases } from "~/domains/__test__/TestCases";

const defaultInputKinder = {
  wohnortBeiAntragsteller: "yes",
  vorname: "",
  nachname: "",
  geburtsdatum: "",
  eigeneEinnahmen: "yes",
  einnahmen: "",
  unterhalt: "yes",
  unterhaltsSumme: "",
} as const;

export const testCasesBeratungshilfeFormularFinanzielleAngabenKinder = {
  hasUnenteredChildren: [
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
      userInput: { hasKinder: "yes" },
    },
    {
      stepId: "/finanzielle-angaben/kinder/uebersicht",
    },
    {
      stepId: "/finanzielle-angaben/kinder/warnung",
    },
  ],
  doesntHaveChildren: [
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
      userInput: { hasKinder: "no" },
    },
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
    },
  ],
  kinderUebersichtTransition: [
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
      userInput: { hasKinder: "yes" },
    },
    {
      stepId: "/finanzielle-angaben/kinder/uebersicht",
      isArraySummary: true,
      userInput: {
        hasKinder: "yes",
        kinder: [
          {
            vorname: "a",
            nachname: "b",
            wohnortBeiAntragsteller: "yes",
            eigeneEinnahmen: "no",
            unterhalt: "no",
            geburtsdatum: "01.01.1990",
            unterhaltsSumme: "0",
            einnahmen: "0",
          },
        ],
      },
    },
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
    },
  ],
  liveInChildWithEigeneEinnahmen: [
    {
      stepId: "/finanzielle-angaben/kinder/uebersicht",
      isArraySummary: true,
      addArrayItemEvent: "add-kinder",
      userInput: {
        kinder: [],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/name",
      userInput: {
        "kinder#vorname": "Clara",
        "kinder#nachname": "Mustermann",
        "kinder#geburtsdatum": "01.01.2005",
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/wohnort",
      userInput: {
        "kinder#wohnortBeiAntragsteller": "yes",
        kinder: [defaultInputKinder],
      },
    },
    {
      stepId:
        "/finanzielle-angaben/kinder/kinder/0/kind-eigene-einnahmen-frage",
      userInput: {
        "kinder#eigeneEinnahmen": "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-eigene-einnahmen",
    },
  ],
  childLivesElsewhereNoUnterhalt: [
    {
      stepId: "/finanzielle-angaben/kinder/uebersicht",
      addArrayItemEvent: "add-kinder",
      userInput: {
        kinder: [],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/name",
      userInput: {
        "kinder#vorname": "Clara",
        "kinder#nachname": "Mustermann",
        "kinder#geburtsdatum": "01.01.2005",
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/wohnort",
      userInput: {
        "kinder#wohnortBeiAntragsteller": "no",
        kinder: [{ ...defaultInputKinder, wohnortBeiAntragsteller: "no" }],
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-unterhalt-frage",
      userInput: {
        "kinder#unterhalt": "no",
        kinder: [{ ...defaultInputKinder, unterhalt: "no" }],
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-unterhalt-ende",
    },
  ],
  childLivesElsewhereWithUnterhalt: [
    {
      stepId: "/finanzielle-angaben/kinder/uebersicht",
      addArrayItemEvent: "add-kinder",
      userInput: {
        kinder: [],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/name",
      userInput: {
        "kinder#vorname": "Clara",
        "kinder#nachname": "Mustermann",
        "kinder#geburtsdatum": "01.01.2005",
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/wohnort",
      userInput: {
        "kinder#wohnortBeiAntragsteller": "no",
        kinder: [{ ...defaultInputKinder, wohnortBeiAntragsteller: "no" }],
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-unterhalt-frage",
      userInput: {
        "kinder#unterhalt": "yes",
        kinder: [defaultInputKinder],
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-unterhalt",
    },
  ],
} satisfies FlowTestCases["testcases"];
