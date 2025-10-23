import { createMachine } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { geldEinklagenFormular } from "..";
import { testCasesForderung } from "../gericht-pruefen/__test__/testCasesForderung";
import { testCasesSachgebiet } from "../gericht-pruefen/sachgebiet/__test__/testCasesSachgebiet";
import { testCasesBeklagtePersonUrheberrecht } from "../gericht-pruefen/beklagtePerson/__test__/testCasesBeklagtePersonUrheberrecht";
import { testCasesBeklagtePersonMiete } from "../gericht-pruefen/beklagtePerson/__test__/testCasesBeklagtePersonMiete";
import { testCasesBeklagteOtherSachgebiet } from "../gericht-pruefen/beklagtePerson/__test__/testCasesBeklagtePersonOtherSachgebiet";
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
  ...testCasesBeklagtePersonUrheberrecht,
  ...testCasesBeklagtePersonMiete,
  ...testCasesBeklagteOtherSachgebiet,
];

export const testCasesGeldEinklagenFormular = {
  machine,
  cases: testsCases,
};
