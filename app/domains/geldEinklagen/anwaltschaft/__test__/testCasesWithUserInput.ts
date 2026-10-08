import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { geldEinklagenAnwaltschaftFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/flowConfig";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";

export const geldEinklagenAnwaltschaftTestCases = {
  xstateConfig: {
    id: "/geld-einklagen/anwaltschaft",
  },
  newEngineConfig: geldEinklagenAnwaltschaftFlowConfig,
  testcases: {
    voraussetzungen: [
      {
        stepId: "/geld-einklagen/anwaltschaft/voraussetzungen",
      },
    ],
  },
} satisfies FlowTestConfig<GeldEinklagenAnwaltschaftUserData>;
