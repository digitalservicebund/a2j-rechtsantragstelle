import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeAbgabeUserData } from "~/domains/beratungshilfe/formular/abgabe/userData";
import { type BeratungshilfeWeitereAngabenUserData } from "~/domains/beratungshilfe/formular/weitereAngaben/userData";

export const testCasesBeratungshilfeFormularAbgabe = {
  onlineAbgabe: [
    { stepId: "/abgabe/zusammenfassung" },
    {
      stepId: "/abgabe/art",
      userInput: { abgabeArt: "online" },
    },
    { stepId: "/abgabe/online" },
  ],
  printedAbgabe: [
    { stepId: "/abgabe/zusammenfassung" },
    {
      stepId: "/abgabe/art",
      userInput: { abgabeArt: "ausdrucken" },
    },
    {
      stepId: "/abgabe/ausdrucken",
    },
  ],
  abgabeUeberpruefung: [
    {
      stepId: "/weitere-angaben",
      userInput: {
        weitereAngaben: "",
      },
    },
    {
      stepId: "/abgabe/ueberpruefung",
    },
  ],
} satisfies FlowTestCases<
  BeratungshilfeAbgabeUserData & BeratungshilfeWeitereAngabenUserData
>;
