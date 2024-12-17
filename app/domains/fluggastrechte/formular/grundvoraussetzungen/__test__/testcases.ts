import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { fluggastrechteGuards } from "~/domains/fluggastrechte/formular/guards";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const happyPathSteps = [
  "/intro/start",
  "/grundvoraussetzungen/prozessfaehig",
  "/grundvoraussetzungen/ausgleichszahlung",
  "/grundvoraussetzungen/daten-uebernahme",
  "/streitwert-kosten/gerichtskosten",
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

export const testCasesFluggastrechteFormularGrundvoraussetzungen = {
  machine,
  cases,
};
