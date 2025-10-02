import { createMachine } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { geldEinklagenFormular } from "..";
import { testCasesGeldEinklagenGerichtPruefen } from "../gericht-pruefen/__test__/testCasesGeldEinklagenGerichtPruefen";
import { testCasesGeldEinklagenGerichtPruefenSachgebiet } from "../gericht-pruefen/sachgebiet/__test__/testCasesGeldEinklagenGerichtPruefenSachgebiet";
import { testCasesGeldEinklagenVerkehrsunfallSchaden } from "../gericht-pruefen/klagendePerson/__test__/testCasesGeldEinklagenVerkehrsunfallSchaden";
import { testCasesGeldEinklagenReisenAnderesRechtsproblemUrheberrecht } from "../gericht-pruefen/klagendePerson/__test__/testCasesGeldEinklagenReisenAnderesRechtsproblemUrheberrecht";
import { testCasesGeldEinklagenMiete } from "../gericht-pruefen/klagendePerson/__test__/testCasesGeldEinklagenMiete";
import { testCasesGeldEinklagenVersicherung } from "../gericht-pruefen/klagendePerson/__test__/testCasesGeldEinklagenVersicherung";

const machine: FlowStateMachine = createMachine(
  { ...geldEinklagenFormular.config, context: {} },
  { guards: {} },
);

const testsCases = [
  ...testCasesGeldEinklagenGerichtPruefen,
  ...testCasesGeldEinklagenGerichtPruefenSachgebiet,
  ...testCasesGeldEinklagenVerkehrsunfallSchaden,
  ...testCasesGeldEinklagenReisenAnderesRechtsproblemUrheberrecht,
  ...testCasesGeldEinklagenMiete,
  ...testCasesGeldEinklagenVersicherung,
];

export const testCasesGeldEinklagenFormular = {
  machine,
  cases: testsCases,
};
