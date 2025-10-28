import type { FlowTestCases } from "~/domains/__test__/TestCases";

export const testCasesPKHFormularFinanzielleAngabenAndereUnterhaltszahlungen = {
  noWeitereUnterhaltszahlungen: [
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      userInput: { hasWeitereUnterhaltszahlungen: "no" },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/alleine-zusammen",
    },
  ],
  weitereUnterhaltszahlungenUnentered: [
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      userInput: { hasWeitereUnterhaltszahlungen: "yes" },
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
      userInput: { hasWeitereUnterhaltszahlungen: "yes" },
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
} satisfies FlowTestCases["testcases"];
