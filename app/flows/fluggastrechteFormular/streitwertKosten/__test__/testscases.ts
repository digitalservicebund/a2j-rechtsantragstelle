import { createMachine } from "xstate";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { TestCases } from "~/flows/__test__/TestCases";
import { fluggastrechtFlow } from "~/flows/fluggastrechteFormular";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
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
      aenderungMitteilung: CheckboxValue.on,
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
