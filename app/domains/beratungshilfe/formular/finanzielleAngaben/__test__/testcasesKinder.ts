import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeFinanzielleAngabenKinderUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/kinder/userData";

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
      skipPageSchemaValidation: true,
      userInput: {
        hasKinder: "yes",
        kinder: [
          {
            vorname: "a",
            nachname: "b",
            geburtsdatum: { day: "01", month: "01", year: "2020" },
            wohnortBeiAntragsteller: "yes",
            eigeneEinnahmen: "no",
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
      skipPageSchemaValidation: true,
      addArrayItemEvent: "add-kinder",
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
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-unterhalt-frage",
      userInput: {
        "kinder#unterhalt": "no",
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
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-unterhalt-frage",
      userInput: {
        "kinder#unterhalt": "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder/0/kind-unterhalt",
    },
  ],
} satisfies FlowTestCases<BeratungshilfeFinanzielleAngabenKinderUserData>;
