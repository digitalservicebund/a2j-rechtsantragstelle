import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";

export const tatsachenvortragTestCases = {
  hasTatsachenvortragComplete: [
    {
      stepId: "/tatsachenvortrag-beweise/uebersicht",
    },
    {
      stepId: "/rechtliche-wuerdigung",
    },
  ],
} satisfies FlowTestCases<GeldEinklagenAnwaltschaftUserData>;
