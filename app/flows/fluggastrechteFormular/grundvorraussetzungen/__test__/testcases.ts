import { createMachine } from "xstate";
import type { TestCases } from "~/flows/__test__/TestCases";
import { fluggastrechtFlow } from "~/flows/fluggastrechteFormular";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import { fluggastrechteGuards } from "~/flows/fluggastrechteFormular/guards";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const happyPathSteps = [
  "intro/start",
  "grundvorraussetzungen/prozessfaehig",
  "grundvorraussetzungen/ausgleichszahlung",
  "grundvorraussetzungen/zahlungsaufforderung",
];

const cases = [
  [
    {
      fluggesellschaft: "TAP",
      bereich: "bereich",
      startAirport: "BER",
      endAirport: "FRA",
    },
    happyPathSteps,
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularGrundvorraussetzungen = {
  machine,
  cases,
};
