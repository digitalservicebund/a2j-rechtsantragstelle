import { createMachine } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { geldEinklagenFormular } from "..";
import { testCasesGeldEinklagenGerichtPruefen } from "../gericht-pruefen/__test__/testCasesGeldEinklagenGerichtPruefen";
import { testCasesGeldEinklagenGerichtPruefenSachgebiet } from "../gericht-pruefen/sachgebiet/__test__/testCasesGeldEinklagenGerichtPruefenSachgebiet";
import { testCasesGeldEinklagenVerkehrsunfallSchadenVersicherung } from "../gericht-pruefen/klagendePerson/__test__/testCasesGeldEinklagenVerkehrsunfallSchadenVersicherung";
import { testCasesGeldEinklagenReisenAnderesRechtsproblemUrheberrecht } from "../gericht-pruefen/klagendePerson/__test__/testCasesGeldEinklagenReisenAnderesRechtsproblemUrheberrecht";
import { testCasesGeldEinklagenMiete } from "../gericht-pruefen/klagendePerson/__test__/testCasesGeldEinklagenMiete";

const machine: FlowStateMachine = createMachine(
  { ...geldEinklagenFormular.config, context: {} },
  { guards: {} },
);

const testsCases = [
  ...testCasesGeldEinklagenGerichtPruefen,
  ...testCasesGeldEinklagenGerichtPruefenSachgebiet,
  ...testCasesGeldEinklagenVerkehrsunfallSchadenVersicherung,
  ...testCasesGeldEinklagenReisenAnderesRechtsproblemUrheberrecht,
  ...testCasesGeldEinklagenMiete,
];

export const testCasesGeldEinklagenFormular = {
  machine,
  cases: testsCases,
};
