import { createMachine } from "xstate";
import { kontopfaendungWegweiser } from "~/domains/kontopfaendung/wegweiser";
import type { FlowStateMachine } from "~/services/flow/server/types";

export const machine: FlowStateMachine = createMachine(
  kontopfaendungWegweiser.config,
);
