import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { fluggastrechteGuards } from "../../guards";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const cases = [
  [
    {
      prozesszinsen: "yes",
    },
    [
      "streitwert-kosten/gerichtskosten",
      "streitwert-kosten/andere-kosten",
      "streitwert-kosten/prozesszinsen",
      "flugdaten/geplanter-flug",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularStreitwertKosten = {
  machine,
  cases,
};
