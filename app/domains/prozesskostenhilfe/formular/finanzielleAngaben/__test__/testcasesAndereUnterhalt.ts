import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "../../userData";
import { PKHTestcaseData } from "../../__test__/testcasesData";

export const testCasesPKHFormularFinanzielleAngabenAndereUnterhaltszahlungen = {
  noWeitereUnterhaltszahlungen: [
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      userInput: {
        ...PKHTestcaseData,
        hasWeitereUnterhaltszahlungen: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/alleine-zusammen",
    },
  ],
  weitereUnterhaltszahlungenUnentered: [
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      userInput: {
        ...PKHTestcaseData,
      },
    },
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
    },
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/warnung",
    },
  ],
  weitereUnterhaltszahlungen: [
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      userInput: {
        ...PKHTestcaseData,
      },
    },
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      addArrayItemEvent: "add-unterhaltszahlungen",
    },
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/person/0/daten",
      userInput: {
        "unterhaltszahlungen#familyRelationship": "kid",
        "unterhaltszahlungen#firstName": "Kind",
        "unterhaltszahlungen#surname": "Mustemann",
        "unterhaltszahlungen#birthday": "01.01.2020",
        "unterhaltszahlungen#monthlyPayment": "100",
      },
    },
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
