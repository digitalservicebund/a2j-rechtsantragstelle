import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import { type ErbscheinWegweiserUserData } from "~/domains/erbschein/wegweiser/userData";
import { erbscheinWegweiserXstateConfig } from "~/domains/erbschein/wegweiser/xStateConfig";

export const erbscheinWegweiserTestCases = {
  xstateConfig: erbscheinWegweiserXstateConfig,
  testcases: {},
} satisfies FlowTestConfig<ErbscheinWegweiserUserData>;
