import { getShortestPaths } from "@xstate/graph";
import isEqual from "lodash/isEqual";
import type {
  MachineConfig,
  MachineContext,
  TransitionConfigOrTarget as XStateTransitionConfigOrTarget,
} from "xstate";
import { initialTransition, pathToStateValue, setup, transition } from "xstate";
import type { GenericGuard, Guards } from "~/domains/guards.server";
import type { UserData } from "~/domains/userData";
import type { ArrayConfigServer } from "~/services/array";
import {
  stateValueToStepIds,
  stepIdToPath,
} from "~/services/flow/stepIdConverter";
import { progressLookupForMachine, vorabcheckProgresses } from "./progress";
import type {
  FlowStateMachineEvents,
  FlowStateMachine,
  StateMachineTypes,
} from "./types";

type Event = "SUBMIT" | "BACK";

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

type Meta<TUserData extends MachineContext = UserData> = {
  customAnalyticsEventName?: string;
  done?: GenericGuard<TUserData>;
  arrays?: Record<string, ArrayConfigServer>;
};

const getSteps = (machine: FlowStateMachine) => {
  // The machine passed here relies on the context it was initialized with.
  // https://www.jsdocs.io/package/xstate#FlowStateMachine.provide is supposed to allow this but context isn't applied
  // idea: machine.provide() with action that assigns the new context

  // Technically, arrayEvents are never triggered. They are only added here to make the subflows reachable to xstate
  const arrayConfig = rootMeta(machine)?.arrays ?? {};
  const arrayEvents = Object.values(arrayConfig).map(({ event }) => ({
    type: event as Event,
  }));

  const possiblePaths = getShortestPaths(machine, {
    events: [{ type: "SUBMIT" }, ...arrayEvents],
  });

  return possiblePaths.flatMap(({ state }) => stateValueToStepIds(state.value));
};

export const nextStepId = (
  machine: FlowStateMachine,
  stepId: string,
  type: Event,
  context: UserData,
) => {
  // First, resolve the state with the given step and context
  const resolvedState = machine.resolveState({
    value: pathToStateValue(stepIdToPath(stepId)),
    context,
  });
  // Get snapshot of next machine state using the given event
  const [destinationState] = transition(machine, resolvedState, { type });
  const destinationStepIds = stateValueToStepIds(destinationState.value);

  // Return undefined if the stepId in the new state matches the previous one
  if (destinationStepIds.length === 1 && destinationStepIds[0] === stepId)
    return undefined;
  return destinationStepIds.at(0);
};

const findNode = (machine: FlowStateMachine, stepId: string) => {
  const statepath = stepIdToPath(stepId);
  const resolvedState = machine.resolveState({
    value: pathToStateValue(statepath),
    context: {},
  });
  return resolvedState._nodes.find((node) => isEqual(node.path, statepath));
};

const isFinalStep = (machine: FlowStateMachine, stepId: string) => {
  const transitions = findNode(machine, stepId)?.transitions;
  return !transitions?.has("SUBMIT");
};

const rootMeta = (machine: FlowStateMachine) => {
  return machine.config?.meta as Meta | undefined;
};

const metaFromStepId = (machine: FlowStateMachine, currentStepId: string) => {
  return findNode(machine, currentStepId)?.meta as Meta | undefined;
};

function getInitial(machine: FlowStateMachine) {
  // The initial state might be nested and needs to be resolved
  const [initialSnapshot] = initialTransition(machine);
  return stateValueToStepIds(initialSnapshot.value).pop();
}

export type StepState = {
  stepId: string;
  isDone: boolean;
  isReachable: boolean;
  url: string;
  subStates?: StepState[];
};

function stepStates(
  stateNode: FlowStateMachine["states"][string],
  reachableSteps: string[],
): StepState[] {
  // Recurse a statenode until encountering a done function or no more substates are left
  // For each encountered statenode a StepState object is returned, containing whether the state is reachable, done and its URL
  const context = (stateNode.machine.config.context ?? {}) as UserData;

  const statesWithDoneFunctionOrSubstates = Object.values(
    stateNode.states ?? {},
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  ).filter((state) => state.meta?.done || Object.keys(state.states).length > 0);

  return statesWithDoneFunctionOrSubstates.map((state) => {
    const stepId = stateValueToStepIds(pathToStateValue(state.path))[0];
    const meta = state.meta as Meta | undefined;
    const hasDoneFunction = meta?.done !== undefined;
    const reachableSubStates = stepStates(state, reachableSteps).filter(
      (state) => state.isReachable,
    );

    // Ignore subflows if empty or parent state has done function
    if (hasDoneFunction || reachableSubStates.length === 0) {
      const initial = state.config.initial as string | undefined;
      const initialStepId = initial ? `${stepId}/${initial}` : stepId;

      // If there is an eventless transition and the target is reachable, use it instead of the initial state
      const eventlessTargetPath = state.initial.target
        .at(0)
        ?.always?.find((val) => {
          // an "always" transition can also be an array, so we need to find the first reachable transition and use it
          const alwaysTransitionPaths = val.target?.at(0)?.path;
          return reachableSteps.includes(
            stateValueToStepIds(
              pathToStateValue(alwaysTransitionPaths ?? []),
            )[0],
          );
        })
        ?.target?.at(0)?.path;

      const eventlessStepId = eventlessTargetPath
        ? stateValueToStepIds(pathToStateValue(eventlessTargetPath))[0]
        : undefined;

      const targetStepId =
        eventlessStepId && reachableSteps.includes(eventlessStepId)
          ? eventlessStepId
          : initialStepId;

      return {
        url: `${state.machine.id}${targetStepId}`,
        isDone: hasDoneFunction ? meta.done!({ context }) : false,
        stepId,
        isReachable: reachableSteps.includes(targetStepId),
      };
    }

    return {
      url: `${state.machine.id}${stepId}`,
      isDone: reachableSubStates.every((state) => state.isDone),
      stepId,
      isReachable: reachableSubStates.length > 0,
      subStates: reachableSubStates,
    };
  });
}

export type FlowController = ReturnType<typeof buildFlowController>;

export const buildFlowController = ({
  config,
  data: context = {},
  guards,
}: {
  config: Config;
  data?: UserData;
  guards?: Guards;
}) => {
  const machine = setup({
    types: {} as StateMachineTypes,
    guards,
  }).createMachine({ ...config, context });
  const flowId = config.id ?? "";
  const reachableSteps = getSteps(machine); // depends on context

  return {
    getMeta: (currentStepId: string) => metaFromStepId(machine, currentStepId),
    getRootMeta: () => rootMeta(machine),
    stepStates: () => stepStates(machine.root, reachableSteps),
    getReachableSteps: () => reachableSteps,
    getUserdata: () => context,
    getConfig: () => config,
    getGuards: () => guards,
    isFinal: (currentStepId: string) => isFinalStep(machine, currentStepId),
    isReachable: (currentStepId: string) => {
      return reachableSteps.includes(currentStepId);
    },
    getPrevious: (stepId: string) => {
      const destination = nextStepId(machine, stepId, "BACK", context);
      if (destination) return `${machine.id}${destination}`;
    },
    getNext: (stepId: string) => {
      const destination = nextStepId(machine, stepId, "SUBMIT", context);
      if (destination) return `${machine.id}${destination}`;
    },
    getInitial: () => `${flowId}${getInitial(machine) ?? ""}`,
    getProgress: (currentStepId: string) => {
      const { total, progressLookup } =
        flowId && flowId in vorabcheckProgresses
          ? vorabcheckProgresses[flowId]
          : progressLookupForMachine(machine);
      return { max: total, progress: progressLookup[currentStepId] };
    },
  };
};
