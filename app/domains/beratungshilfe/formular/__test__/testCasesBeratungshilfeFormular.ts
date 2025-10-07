import { createMachine } from "xstate";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { beratungshilfeFormular } from "..";
import { testCasesBeratungshilfeFormularAbgabe } from "../abgabe/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentum } from "../finanzielleAngaben/__test__/testcasesEigentum";

const { config, guards } = beratungshilfeFormular;
const machine: FlowStateMachine = createMachine(config, { guards });

const testsCases = [
  ...testCasesBeratungshilfeFormularAbgabe,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenEigentum,
];

export const testCasesBeratungshilfeFormular = {
  machine,
  cases: testsCases,
};
