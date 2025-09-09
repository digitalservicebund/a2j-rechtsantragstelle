import {
  setup,
  type MachineConfig,
  type MachineContext,
  type TransitionConfigOrTarget as XStateTransitionConfigOrTarget,
} from "xstate";
import type { GenericGuard, Guards } from "~/domains/guards.server";
import { type UserData } from "~/domains/userData";
import { type ArrayConfigServer } from "~/services/array";

export type NavigationEvent = "SUBMIT" | "BACK";

type FlowStateMachineEvents =
  | { type: NavigationEvent }
  | { type: ArrayConfigServer["event"] };

export type StateMachineTypes = {
  context: UserData;
  events: FlowStateMachineEvents;
};

const _genericMachine = setup({
  types: {} as StateMachineTypes,
  guards: {} as Guards,
});

export type FlowStateMachine = ReturnType<typeof _genericMachine.createMachine>;

export type Config<TContext extends MachineContext = UserData> = MachineConfig<
  TContext,
  FlowStateMachineEvents,
  never,
  never,
  { type: string; params: unknown },
  never,
  never,
  never,
  never,
  never,
  Meta<TContext>
>;
type TransitionConfigOrTarget<TUserData extends MachineContext = UserData> =
  XStateTransitionConfigOrTarget<
    TUserData,
    FlowStateMachineEvents,
    FlowStateMachineEvents,
    never,
    never,
    { type: string; params: unknown },
    never,
    never,
    Meta
  >;

export type FlowConfigTransitions = {
  backToCallingFlow?: TransitionConfigOrTarget;
  nextFlowEntrypoint?: TransitionConfigOrTarget;
};

export type Meta<TUserData extends MachineContext = UserData> = {
  excludedFromValidation?: boolean;
  triggerValidation?: boolean;
  done?: GenericGuard<TUserData>;
  arrays?: Record<string, ArrayConfigServer>;
};
