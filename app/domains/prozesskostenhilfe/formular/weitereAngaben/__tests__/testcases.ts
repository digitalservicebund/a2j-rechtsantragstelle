import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { pkhTestcaseData } from "../../__test__/testcasesData";

export const testCasesPKHFormularWeitereAngaben = {
  weitereAngaben: [
    {
      stepId: "/persoenliche-daten/beruf",
      userInput: {
        ...pkhTestcaseData,
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
    },
    {
      stepId: "/abgabe/zusammenfassung",
    },
    {
      stepId: "/abgabe/ende",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
