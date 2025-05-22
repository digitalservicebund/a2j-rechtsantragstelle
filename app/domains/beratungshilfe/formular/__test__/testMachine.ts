import { createMachine } from "xstate";
import { beratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import type { FlowStateMachine } from "~/services/flow/server/types";

export const machine: FlowStateMachine = createMachine(
  beratungshilfeFormularUserData.config,
  {
    guards: beratungshilfeFormularUserData.guards,
  },
);
