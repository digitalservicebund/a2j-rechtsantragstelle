import type { FlowTestCases } from "~/domains/__test__/TestCases";

export const testCasesPKHFormularFinanzielleAngabenKinder = {
  doesntHaveChildren: [
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
      userInput: { hasKinder: "no" },
    },
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
    },
  ],
  unenteredChildren: [
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
  kinderEmptyArray: [
    {
      stepId: "/finanzielle-angaben/kinder/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        kinder: [],
        hasKinder: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/warnung",
    },
  ],
  liveInChildWithEinnahmen: [
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
      userInput: { hasKinder: "yes" },
    },
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
        "kinder#wohnortBeiAntragsteller": "yes",
        kinder: [
          {
            wohnortBeiAntragsteller: "yes",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/kinder/kinder/0/kind-eigene-einnahmen-frage",
      userInput: {
        "kinder#eigeneEinnahmen": "yes",
        kinder: [
          {
            eigeneEinnahmen: "yes",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-eigene-einnahmen",
      userInput: { "kinder#einnahmen": "100" },
    },
    {
      stepId: "/finanzielle-angaben/kinder/uebersicht",
    },
  ],
  childLivesSeparateWithUnterhalt: [
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
      userInput: { hasKinder: "yes" },
    },
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
        kinder: [
          {
            wohnortBeiAntragsteller: "no",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-unterhalt-frage",
      userInput: {
        "kinder#unterhalt": "yes",
        kinder: [
          {
            unterhalt: "yes",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-unterhalt",
      userInput: { "kinder#unterhaltsSumme": "100" },
    },
    {
      stepId: "/finanzielle-angaben/kinder/uebersicht",
    },
  ],
  childLivesSeparateNoUnterhalt: [
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
      userInput: { hasKinder: "yes" },
    },
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
        kinder: [
          {
            wohnortBeiAntragsteller: "no",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-unterhalt-frage",
      userInput: {
        "kinder#unterhalt": "no",
        kinder: [
          {
            unterhalt: "no",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/kind-unterhalt-ende",
    },
    {
      stepId: "/finanzielle-angaben/kinder/uebersicht",
    },
  ],
} satisfies FlowTestCases["testcases"];
