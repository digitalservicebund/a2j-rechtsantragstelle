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
  "grundvoraussetzungen/prozessfaehig",
  "grundvoraussetzungen/ausgleichszahlung",
  "grundvoraussetzungen/zahlungsaufforderung",
  "grundvoraussetzungen/daten-uebernahme",
  "streitwert-kosten/gerichtskosten",
];

const cases = [
  [
    {
      fluggesellschaft: "TAP",
      bereich: "bereich",
      startAirport: "BER",
      endAirport: "FRA",
      zahlungsaufforderung: "no",
    },
    happyPathSteps,
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularGrundvoraussetzungen = {
  machine,
  cases,
};
