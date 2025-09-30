import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { beratungshilfeXstateConfig } from "../xstateConfig";
import { testCasesBeratungshilfeFormularDefault } from "~/domains/beratungshilfe/formular/__test__/testcases";
import { testCasesBeratungshilfeFormularAnwaltlicheVertretung } from "~/domains/beratungshilfe/formular/anwaltlicheVertretung/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesAusgaben";

export const beratungshilfeAntragTestCases = {
  xstateConfig: beratungshilfeXstateConfig,
  testcases: {
    ...testCasesBeratungshilfeFormularDefault,
    ...testCasesBeratungshilfeFormularAnwaltlicheVertretung,
    ...testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe,
  },
} satisfies FlowTestCases;
