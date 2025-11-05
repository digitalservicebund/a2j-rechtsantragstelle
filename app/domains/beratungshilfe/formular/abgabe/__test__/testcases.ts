import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

const showFileUpload = await isFeatureFlagEnabled("showFileUpload");
const showAutoSummary = await isFeatureFlagEnabled("showAutoSummary");

export const testCasesBeratungshilfeFormularAbgabe = {
  onlineAbgabe: [
    {
      stepId: "/abgabe/art",
      userInput: { abgabeArt: "online" },
    },
    ...(showAutoSummary
      ? [
          {
            stepId: "/abgabe/zusammenfassung",
          },
        ]
      : []),
    ...(showFileUpload
      ? [
          {
            stepId: "/abgabe/dokumente",
          },
        ]
      : [{ stepId: "/abgabe/online" }]),
  ],
  printedAbgabe: [
    {
      stepId: "/abgabe/art",
      userInput: { abgabeArt: "ausdrucken" },
    },
    ...(showAutoSummary
      ? [
          {
            stepId: "/abgabe/zusammenfassung",
          },
        ]
      : []),
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
