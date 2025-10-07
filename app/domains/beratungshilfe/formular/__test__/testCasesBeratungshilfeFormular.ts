import { createMachine } from "xstate";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { beratungshilfeFormular } from "..";
import { testCasesBeratungshilfeFormularAbgabe } from "../abgabe/__test__/testcases";

const { config, guards } = beratungshilfeFormular;
const machine: FlowStateMachine = createMachine(config, { guards });

const testsCases = [...testCasesBeratungshilfeFormularAbgabe];

export const testCasesBeratungshilfeFormular = {
  machine,
  cases: testsCases,
};
