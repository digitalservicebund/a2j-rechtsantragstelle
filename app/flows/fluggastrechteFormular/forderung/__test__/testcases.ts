import { createMachine } from "xstate";
import type { TestCases } from "~/flows/__test__/TestCases";
import { fluggastrechtFlow } from "~/flows/fluggastrechteFormular";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import { fluggastrechteGuards } from "~/flows/fluggastrechteFormular/guards";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: { ...fluggastrechteGuards } },
);

const cases = [
  [
    {},
    [
      "forderung/forderung",
      "forderung/teilentschaedigung",
      "forderung/nebenforderungen",
      "versand/frist",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularForderung = {
  machine,
  cases,
};
