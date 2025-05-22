import { setup } from "xstate";
import { type Context } from "~/domains/userData";
import type { Guards } from "~/domains/guards.server";
import { type ArrayConfigServer } from "~/services/array";

export type FlowStateMachineEvents =
  | { type: "SUBMIT" }
  | { type: "BACK" }
  | { type: ArrayConfigServer["event"] };

export type StateMachineTypes = {
  context: Context;
  events: FlowStateMachineEvents;
};

const _genericMachine = setup({
  types: {} as StateMachineTypes,
  guards: {} as Guards,
});

export type FlowStateMachine = ReturnType<typeof _genericMachine.createMachine>;
