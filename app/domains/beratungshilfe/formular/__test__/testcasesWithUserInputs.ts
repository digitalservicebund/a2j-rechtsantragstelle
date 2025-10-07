import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { beratungshilfeXstateConfig } from "../xstateConfig";
import { testCasesBeratungshilfeFormularDefault } from "~/domains/beratungshilfe/formular/__test__/testcases";
import { testCasesBeratungshilfeFormularAnwaltlicheVertretung } from "~/domains/beratungshilfe/formular/anwaltlicheVertretung/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesAusgaben";
import { testCasesBeratungshilfeFormularGrundvoraussetzungen } from "~/domains/beratungshilfe/formular/grundvoraussetzung/__test__/testcases";
import { testCasesBeratungshilfeRechtsproblem } from "~/domains/beratungshilfe/formular/rechtsproblem/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesEinkommen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenPartner } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesPartner";
import { testCasesBeratungshilfeFormularFinanzielleAngabenKinder } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesKinder";
import { testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesUnterhaltszahlungen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenWohnung } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesWohnung";

export const beratungshilfeAntragTestCases = {
  xstateConfig: beratungshilfeXstateConfig,
  testcases: {
    ...testCasesBeratungshilfeFormularDefault,
    ...testCasesBeratungshilfeFormularGrundvoraussetzungen,
    ...testCasesBeratungshilfeFormularAnwaltlicheVertretung,
    ...testCasesBeratungshilfeRechtsproblem,
    ...testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen,
    ...testCasesBeratungshilfeFormularFinanzielleAngabenPartner,
    ...testCasesBeratungshilfeFormularFinanzielleAngabenKinder,
    ...testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen,
    ...testCasesBeratungshilfeFormularFinanzielleAngabenWohnung,
    ...testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe,
  },
} satisfies FlowTestCases;
