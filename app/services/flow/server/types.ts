import { setup } from "xstate";
import type { Guards } from "~/domains/guards.server";
import { type UserData } from "~/domains/userData";
import { type ArrayConfigServer } from "~/services/array";

export type NavigationEvent = "SUBMIT" | "BACK" | ArrayConfigServer["event"];

type FlowStateMachineEvents = { type: NavigationEvent };

export type StateMachineTypes = {
  context: UserData;
  events: FlowStateMachineEvents;
};

class ConfigExtractor<TContext extends UserData> {
  getSetup() {
    return setup({
      types: {
        context: {} as TContext,
        events: {} as FlowStateMachineEvents,
      },
      guards: {} as Guards,
    });
  }
}

type MachineFactory<T extends UserData> = ReturnType<
  ConfigExtractor<T>["getSetup"]
>["createMachine"];

export type FlowStateMachine<T extends UserData = UserData> = ReturnType<
  MachineFactory<T>
>;

export type Config<T extends UserData = UserData> = Parameters<
  MachineFactory<T>
>[0];

export type XstateStates<T extends UserData = UserData> = NonNullable<
  Config<T>["states"]
>;

// 2. Index directly using NavigationEvent and XState's wildcard
export type TransitionConfigOrTarget<T extends UserData = UserData> =
  NonNullable<XstateStates<T>[string]["on"]>[NavigationEvent | "*"];

export type FlowConfigTransitions = {
  backToCallingFlow?: TransitionConfigOrTarget;
  nextFlowEntrypoint?: TransitionConfigOrTarget;
};

export type Meta = {
  excludedFromValidation?: boolean;
  triggerValidation?: boolean;
  shouldAppearAsMenuNavigation?: boolean;
  arrays?: Record<string, ArrayConfigServer>;
};
