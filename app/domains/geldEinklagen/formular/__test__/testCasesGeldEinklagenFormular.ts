import { createMachine } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { geldEinklagenFormular } from "..";
import { testCasesGeldEinklagenGerichtPruefen } from "../gericht-pruefen/__test__/testCasesGeldEinklagenGerichtPruefen";
import { testCasesGeldEinklagenGerichtPruefenSachgebiet } from "../gericht-pruefen/sachgebiet/__test__/testCasesGeldEinklagenGerichtPruefenSachgebiet";

const machine: FlowStateMachine = createMachine(
  { ...geldEinklagenFormular.config, context: {} },
  { guards: {} },
);

const testsCases = [
  ...testCasesGeldEinklagenGerichtPruefen,
  ...testCasesGeldEinklagenGerichtPruefenSachgebiet,
];

export const testCasesGeldEinklagenFormular = {
  machine,
  cases: testsCases,
};
