import type { FlowTestCases } from "~/domains/__test__/TestCases";

export const testCasesBeratungshilfeFormularAbgabe = {
  onlineAbgabe: [
    {
      stepId: "/abgabe/zusammenfassung",
    },
    {
      stepId: "/abgabe/art",
      userInput: { abgabeArt: "online" },
    },
    {
      stepId: "/abgabe/dokumente",
      userInput: {},
    },
    { stepId: "/abgabe/online" },
  ],
  printedAbgabe: [
    {
      stepId: "/abgabe/zusammenfassung",
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
        weitereAngaben: undefined,
      },
    },
    {
      stepId: "/abgabe/ueberpruefung",
    },
  ],
} satisfies FlowTestCases["testcases"];
