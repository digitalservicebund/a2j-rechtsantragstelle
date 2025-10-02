import { createMachine } from "xstate";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesEinkommen";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { beratungshilfeFormular } from "..";
import { testCasesBeratungshilfeFormularAbgabe } from "../abgabe/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentum } from "../finanzielleAngaben/__test__/testcasesEigentum";
import { testCasesBeratungshilfeFormularFinanzielleAngabenKinder } from "../finanzielleAngaben/__test__/testcasesKinder";
import { testCasesBeratungshilfeFormularFinanzielleAngabenPartner } from "../finanzielleAngaben/__test__/testcasesPartner";
import { testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen } from "../finanzielleAngaben/__test__/testcasesUnterhaltszahlungen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenWohnung } from "../finanzielleAngaben/__test__/testcasesWohnung";
import { testCasesBeratungshilfeFormularGrundvoraussetzungen } from "../grundvoraussetzung/__test__/testcases";
import { testCasesBeratungshilfeRechtsproblem } from "../rechtsproblem/__test__/testcases";

const { config, guards } = beratungshilfeFormular;
const machine: FlowStateMachine = createMachine(config, { guards });

const testsCases = [
  ...testCasesBeratungshilfeFormularAbgabe,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenEigentum,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenKinder,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenPartner,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenWohnung,
  ...testCasesBeratungshilfeFormularGrundvoraussetzungen,
  ...testCasesBeratungshilfeRechtsproblem,
];

export const testCasesBeratungshilfeFormular = {
  machine,
  cases: testsCases,
};
