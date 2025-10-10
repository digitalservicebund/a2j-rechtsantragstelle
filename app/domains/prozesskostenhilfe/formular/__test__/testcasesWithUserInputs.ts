import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { prozesskostenhilfeFormular } from "~/domains/prozesskostenhilfe/formular";
import { testCasesPKHFormularGrundvoraussetzungen } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/__test__/testcases";

export const prozesskostenhilfeFormularTestCases = {
  xstateConfig: prozesskostenhilfeFormular.config,
  testcases: {
    ...testCasesPKHFormularGrundvoraussetzungen,
    weitereAngaben: [
      {
        stepId: "/persoenliche-daten/beruf",
        userInput: {
          beruf: "Softwareentwickler:in",
        },
      },
      {
        stepId: "/weitere-angaben",
        userInput: {
          weitereAngaben: "",
        },
      },
      {
        stepId: "/abgabe/ueberpruefung",
        userInput: {
          weitereAngaben: "",
        },
      },
    ],
  },
} satisfies FlowTestCases;
