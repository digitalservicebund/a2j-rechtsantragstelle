import { createMachine } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { geldEinklagenFormular } from "..";
import { testCasesGeldEinklagenGerichtPruefen } from "../gericht-pruefen/__test__/testCasesGeldEinklagenGerichtPruefen";

const machine: FlowStateMachine = createMachine(
  { ...geldEinklagenFormular.config, context: {} },
  { guards: {} },
);

const testsCases = [...testCasesGeldEinklagenGerichtPruefen];

export const testCasesGeldEinklagenFormular = {
  machine,
  cases: testsCases,
};
