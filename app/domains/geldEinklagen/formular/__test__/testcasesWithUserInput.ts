import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../userData";
import { geldEinklagenFlowConfig } from "../flowConfig";
import { geldEinklagenFormular } from "..";
import { testCasesWithUserInputIntroForderung } from "../gericht-pruefen/__test__/testCasesWithUserInput";

export const geldEinklagenFormularTestCases = {
  xstateConfig: geldEinklagenFormular.config,
  newEngineConfig: geldEinklagenFlowConfig,
  testcases: {
    ...testCasesWithUserInputIntroForderung,
  },
} satisfies FlowTestConfig<
  GeldEinklagenFormularUserData,
  typeof geldEinklagenFlowConfig.pages
>;
