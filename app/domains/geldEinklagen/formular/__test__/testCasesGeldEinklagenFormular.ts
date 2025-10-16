import { createMachine } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { geldEinklagenFormular } from "..";
import { testCasesForderung } from "../gericht-pruefen/__test__/testCasesForderung";
import { testCasesSachgebiet } from "../gericht-pruefen/sachgebiet/__test__/testCasesSachgebiet";
import { testCasesKlagendePersonVerkehrsunfallSchadenVersicherung } from "../gericht-pruefen/klagendePerson/__test__/testCasesKlagendePersonVerkehrsunfallSchadenVersicherung";
import { testCasesKlagendePersonReisenAnderesRechtsproblemUrheberrecht } from "../gericht-pruefen/klagendePerson/__test__/testCasesKlagendePersonReisenAnderesRechtsproblemUrheberrecht";
import { testCasesKlagendePersonMiete } from "../gericht-pruefen/klagendePerson/__test__/testCasesKlagendePersonMiete";

const machine: FlowStateMachine = createMachine(
  { ...geldEinklagenFormular.config, context: {} },
  { guards: {} },
);

const testsCases = [
  ...testCasesForderung,
  ...testCasesSachgebiet,
  ...testCasesKlagendePersonVerkehrsunfallSchadenVersicherung,
  ...testCasesKlagendePersonReisenAnderesRechtsproblemUrheberrecht,
  ...testCasesKlagendePersonMiete,
];

export const testCasesGeldEinklagenFormular = {
  machine,
  cases: testsCases,
};
