import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

const showFileUpload = await isFeatureFlagEnabled("showFileUpload");

export const testCasesBeratungshilfeFormularAbgabe = {
  onlineAbgabe: [
    {
      stepId: "/abgabe/zusammenfassung",
    },
    {
      stepId: "/abgabe/art",
      userInput: { abgabeArt: "online" },
    },
    ...(showFileUpload
      ? [
          {
            stepId: "/abgabe/dokumente",
            userInput: {},
          },
        ]
      : [{ stepId: "/abgabe/online" }]),
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
        weitereAngaben: "",
      },
    },
    {
      stepId: "/abgabe/ueberpruefung",
    },
  ],
} satisfies FlowTestCases["testcases"];
