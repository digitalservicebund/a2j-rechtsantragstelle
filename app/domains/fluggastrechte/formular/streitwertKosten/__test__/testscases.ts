import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: {} },
);

const cases = [
  [
    {
      versaeumnisurteil: "yes",
      prozesszinsen: "yes",
    },
    [
      "streitwert-kosten/gerichtskosten",
      "streitwert-kosten/andere-kosten",
      "streitwert-kosten/zahlung-nach-klageeinreichung",
      "streitwert-kosten/prozesszinsen",
      "streitwert-kosten/versaeumnisurteil",
      "flugdaten/geplanter-flug",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularStreitwertKosten = {
  machine,
  cases,
};
