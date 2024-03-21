import { createMachine } from "xstate";
import { beratungshilfeFormular } from "~/models/flows/beratungshilfeFormular";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

export const machine: FlowStateMachine = createMachine(
  beratungshilfeFormular.config,
  {
    guards: beratungshilfeFormular.guards,
  },
);
