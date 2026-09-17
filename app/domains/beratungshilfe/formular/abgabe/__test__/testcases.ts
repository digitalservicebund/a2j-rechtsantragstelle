import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { reachPersoenlicheDaten } from "~/domains/beratungshilfe/formular/__test__/reachData";

export const testCasesBeratungshilfeFormularAbgabe = {
  onlineAbgabe: [
    {
      stepId: "/abgabe/zusammenfassung",
      skipPageSchemaValidation: true,
      userInput: { ...reachPersoenlicheDaten },
    },
    {
      stepId: "/abgabe/art",
      userInput: { abgabeArt: "online" },
    },
    { stepId: "/abgabe/online" },
  ],
  printedAbgabe: [
    {
      stepId: "/abgabe/zusammenfassung",
      skipPageSchemaValidation: true,
      userInput: { ...reachPersoenlicheDaten },
    },
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
} satisfies FlowTestCases<BeratungshilfeFormularUserData>;
