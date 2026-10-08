import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { geldEinklagenAnwaltschaftFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/flowConfig";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";

export const geldEinklagenAnwaltschaftTestCases = {
  xstateConfig: {
    id: "/geld-einklagen/anwaltschaft",
  },
  newEngineConfig: geldEinklagenAnwaltschaftFlowConfig,
  testcases: {
    basePagesUntilKlagendePartei: [
      {
        stepId: "/voraussetzungen/intro",
      },
      {
        stepId: "/inhalt-klage",
        userInput: {
          zahlungsklageSubjectLine: "Subject",
          zahlungsklageGesamtstreitwert: "1000",
        },
      },
      {
        stepId: "/pilotgericht",
        userInput: {
          pilotgericht: "steinfurt",
        },
      },
    ],
  },
} satisfies FlowTestConfig<GeldEinklagenAnwaltschaftUserData>;
