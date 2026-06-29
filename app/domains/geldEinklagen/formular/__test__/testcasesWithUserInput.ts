import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../userData";
import { geldEinklagenFlowConfig } from "../flowConfig";
import { geldEinklagenFormular } from "..";
import { testCasesWithUserInputIntroForderung } from "../gericht-pruefen/__test__/testCasesWithUserInput";
import { testCasesWithUserInputSachgebiet } from "../gericht-pruefen/sachgebiet/__test__/testCasesWithUserInput";
import { testCasesWithUserInputKlagendePerson } from "../gericht-pruefen/klagendePerson/__test__/testCasesWithUserInput";

export const geldEinklagenFormularTestCases = {
  xstateConfig: geldEinklagenFormular.config,
  newEngineConfig: geldEinklagenFlowConfig,
  testcases: {
    ...testCasesWithUserInputIntroForderung,
    ...testCasesWithUserInputSachgebiet,
    ...testCasesWithUserInputKlagendePerson,
  },
} satisfies FlowTestConfig<
  GeldEinklagenFormularUserData,
  typeof geldEinklagenFlowConfig.pages
>;
