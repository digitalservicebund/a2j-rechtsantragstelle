import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FlowStateMachine } from "~/services/flow/server/types";
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
      "/streitwert-kosten/gerichtskosten",
      "/streitwert-kosten/andere-kosten",
      "/streitwert-kosten/prozesszinsen",
      "/flugdaten/adresse-fluggesellschaft",
    ],
  ],
] as const satisfies TestCases<FluggastrechteUserData>;

export const testCasesFluggastrechteFormularStreitwertKosten = {
  machine,
  cases,
};
