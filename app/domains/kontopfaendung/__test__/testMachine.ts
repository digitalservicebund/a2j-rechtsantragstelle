import { createMachine } from "xstate";
import { kontopfaendungWegweiserXstateConfig } from "~/domains/kontopfaendung/wegweiser/xStateConfig";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

export const machine: FlowStateMachine = createMachine(
  kontopfaendungWegweiserXstateConfig,
);
