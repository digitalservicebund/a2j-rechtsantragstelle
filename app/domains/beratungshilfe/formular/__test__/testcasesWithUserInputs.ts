import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { beratungshilfeXstateConfig } from "../xstateConfig";
import { testCasesBeratungshilfeFormularDefault } from "~/domains/beratungshilfe/formular/__test__/testcases";

export const beratungshilfeAntragTestCases = {
  xstateConfig: beratungshilfeXstateConfig,
  testcases: {
    ...testCasesBeratungshilfeFormularDefault,
  },
} satisfies FlowTestCases;
