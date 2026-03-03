import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import { type ErbscheinWegweiserUserData } from "~/domains/erbschein/wegweiser/userData";
import { erbscheinWegweiserXstateConfig } from "~/domains/erbschein/wegweiser/xStateConfig";

export const erbscheinWegweiserTestCases = {
  xstateConfig: erbscheinWegweiserXstateConfig,
  testcases: {
    severalNationalities: [
      {
        stepId: "/start",
      },
      {
        stepId: "/staatsangehoerigkeit",
        userInput: {
          staatsangehoerigkeit: "germanAndOther",
        },
      },
      {
        stepId: "/ergebnis/auslandsbezug",
      },
    ],
    livedAbroad: [
      {
        stepId: "/staatsangehoerigkeit",
        userInput: {
          staatsangehoerigkeit: "german",
        },
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "ausland",
        },
      },
      {
        stepId: "/ergebnis/auslandsbezug",
      },
    ],
    notarizedTestament: [
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "notarized",
        },
      },
      {
        stepId: "/ergebnis/erbschein-nicht-erforderlich-notarielles-testament",
      },
    ],
    erbvertrag: [
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "erbvertrag",
        },
      },
      {
        stepId: "/ergebnis/erbschein-nicht-erforderlich-erbvertrag",
      },
    ],
    hasGrundeigentumWithHandwrittenTestament: [
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "handwritten",
        },
      },
      {
        stepId: "/grundeigentum",
        userInput: {
          hasGrundeigentum: "yes",
        },
      },
      {
        stepId: "/ergebnis/erbschein-erforderlich-handschriftliches-testament",
      },
    ],
    hasGrundeigentumWithNoTestament: [
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "none",
        },
      },
      {
        stepId: "/grundeigentum",
        userInput: {
          hasGrundeigentum: "yes",
        },
      },
      {
        stepId: "/ergebnis/erbschein-erforderlich-kein-testament",
      },
    ],
    hasUnternehmenWithHandwrittenTestament: [
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "handwritten",
        },
      },
      {
        stepId: "/grundeigentum",
        userInput: {
          hasGrundeigentum: "no",
        },
      },
      {
        stepId: "/unternehmen",
        userInput: {
          hasUnternehmen: "yes",
        },
      },
      {
        stepId: "/ergebnis/erbschein-erforderlich-handschriftliches-testament",
      },
    ],
    hasUnternehmenWithNoTestament: [
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "none",
        },
      },
      {
        stepId: "/grundeigentum",
        userInput: {
          hasGrundeigentum: "no",
        },
      },
      {
        stepId: "/unternehmen",
        userInput: {
          hasUnternehmen: "yes",
        },
      },
      {
        stepId: "/ergebnis/erbschein-erforderlich-kein-testament",
      },
    ],
    erbscheinNotRequired: [
      {
        stepId: "/unternehmen",
        userInput: {
          hasUnternehmen: "no",
        },
      },
      {
        stepId: "/erbschein-verlangt",
        userInput: {
          bankRequestedErbschein: "no",
        },
      },
      {
        stepId: "/ergebnis/erbschein-nicht-erforderlich-nicht-verlangt",
      },
    ],
    erbscheinRequired: [
      {
        stepId: "/erbschein-verlangt",
        userInput: {
          bankRequestedErbschein: "yes",
        },
      },
      {
        stepId: "/ergebnis/erbschein-erforderlich-kein-testament",
      },
    ],
  },
} satisfies FlowTestConfig<ErbscheinWegweiserUserData>;
