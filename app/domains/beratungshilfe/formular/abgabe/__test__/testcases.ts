import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { reachPersoenlicheDaten } from "~/domains/beratungshilfe/formular/__test__/reachData";

// Abgabe is only reachable once every other section is done
const allSectionsDone = {
  subflowDoneStates: {
    "/start": true,
    "/grundvoraussetzungen": true,
    "/anwaltliche-vertretung": true,
    "/rechtsproblem": true,
    "/finanzielle-angaben": true,
    "/persoenliche-daten": true,
    "/weitere-angaben": true,
  },
};

export const testCasesBeratungshilfeFormularAbgabe = {
  onlineAbgabe: [
    {
      stepId: "/abgabe/zusammenfassung",
      skipPageSchemaValidation: true,
      userInput: { ...reachPersoenlicheDaten },
      pageData: allSectionsDone,
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
      pageData: allSectionsDone,
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
