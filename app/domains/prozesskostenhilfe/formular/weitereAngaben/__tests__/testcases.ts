import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { finanzielleAngabenTestcaseData } from "../../__test__/testcasesData";

export const testCasesPKHFormularWeitereAngaben = {
  weitereAngaben: [
    {
      stepId: "/persoenliche-daten/beruf",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
      stepId: "/abgabe/zusammenfassung",
      userInput: {
        weitereAngaben: "",
      },
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
