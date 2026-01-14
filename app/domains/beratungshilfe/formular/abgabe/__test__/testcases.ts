import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeAbgabeUserData } from "~/domains/beratungshilfe/formular/abgabe/userData";
import { type BeratungshilfeWeitereAngabenUserData } from "~/domains/beratungshilfe/formular/weitereAngaben/userData";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

const showFileUpload = await isFeatureFlagEnabled("showFileUpload");
const showAutoSummary = await isFeatureFlagEnabled("showAutoSummary");

export const testCasesBeratungshilfeFormularAbgabe = {
  onlineAbgabe: [
    {
      stepId: "/abgabe/art",
      userInput: { abgabeArt: "online", stepDoneStates: {} },
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
      userInput: { abgabeArt: "ausdrucken", stepDoneStates: {} },
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
