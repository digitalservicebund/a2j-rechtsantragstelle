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
        stepId: "/verstorbene-name",
        userInput: {
          verstorbeneName: "Max Mustermann",
        },
      },
      {
        stepId: "/staatsangehoerigkeit",
        userInput: {
          staatsangehoerigkeit: "germanAndOther",
        },
      },
      {
        stepId: "/ergebnis/auslaendische-erbfaelle",
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
        stepId: "/ergebnis/auslaendische-erbfaelle",
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
        stepId: "/ergebnis/notarized-testament",
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
        stepId: "/ergebnis/erbvertrag",
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
        stepId: "/ergebnis/erbschein-required-handwritten-testament",
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
        stepId: "/ergebnis/erbschein-required-no-testament",
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
        stepId: "/ergebnis/erbschein-required-handwritten-testament",
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
        stepId: "/ergebnis/erbschein-required-no-testament",
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
        stepId: "/erbschein-requested-by-bank",
        userInput: {
          bankRequestedErbschein: "no",
        },
      },
      {
        stepId: "/ergebnis/erbschein-not-required",
      },
    ],
    erbscheinRequired: [
      {
        stepId: "/erbschein-requested-by-bank",
        userInput: {
          bankRequestedErbschein: "yes",
        },
      },
      {
        stepId: "/ergebnis/erbschein-required-no-testament",
      },
    ],
  },
} satisfies FlowTestConfig<ErbscheinWegweiserUserData>;
