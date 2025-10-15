import { createMachine } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { geldEinklagenFormular } from "..";
import { testCasesGeldEinklagenGerichtPruefen } from "../gericht-pruefen/__test__/testCasesGeldEinklagenGerichtPruefen";
import { testCasesGeldEinklagenGerichtPruefenSachgebiet } from "../gericht-pruefen/sachgebiet/__test__/testCasesGeldEinklagenGerichtPruefenSachgebiet";
import { testCasesGeldEinklagenVerkehrsunfallSchadenVersicherung } from "../gericht-pruefen/klagendePerson/__test__/testCasesGeldEinklagenVerkehrsunfallSchadenVersicherung";
import { testCasesGeldEinklagenReisenAnderesRechtsproblemUrheberrecht } from "../gericht-pruefen/klagendePerson/__test__/testCasesGeldEinklagenReisenAnderesRechtsproblemUrheberrecht";
import { testCasesGeldEinklagenMiete } from "../gericht-pruefen/klagendePerson/__test__/testCasesGeldEinklagenMiete";
import { testCasesBeklagtePersonUrheberrecht } from "../gericht-pruefen/beklagtePerson/__test__/testCasesBeklagtePersonUrheberrecht";
import { testCasesBeklagtePersonMiete } from "../gericht-pruefen/beklagtePerson/__test__/testCasesBeklagtePersonMiete";
import { testCasesBeklagteOtherSachgebiet } from "../gericht-pruefen/beklagtePerson/__test__/testCasesBeklagtePersonOtherSachgebiet";

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
  ...testCasesBeklagtePersonUrheberrecht,
  ...testCasesBeklagtePersonMiete,
  ...testCasesBeklagteOtherSachgebiet,
];

export const testCasesGeldEinklagenFormular = {
  machine,
  cases: testsCases,
};
