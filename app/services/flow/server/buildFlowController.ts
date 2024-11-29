import { getShortestPaths } from "@xstate/graph";
import _ from "lodash";
import type {
  MachineConfig,
  MachineContext,
  TransitionConfigOrTarget as XStateTransitionConfigOrTarget,
} from "xstate";
import { initialTransition, pathToStateValue, setup, transition } from "xstate";
import type { Context } from "~/domains/contexts";
import type { GenericGuard, Guards } from "~/domains/guards.server";
import type { ArrayConfigFlow } from "~/services/array";
import {
  stateValueToStepIds,
  stepIdToPath,
} from "~/services/flow/stepIdConverter";
import { progressLookupForMachine, vorabcheckProgresses } from "./progress";

type Event = "SUBMIT" | "BACK";
type FlowStateMachineEvents =
  | { type: "SUBMIT" }
  | { type: "BACK" }
  | { type: ArrayConfigFlow["event"] };

type StateMachineTypes = {
  context: Context;
  events: FlowStateMachineEvents;
};

const _genericMachine = setup({
  types: {} as StateMachineTypes,
  guards: {} as Guards,
});

export type FlowStateMachine = ReturnType<typeof _genericMachine.createMachine>;

export type Config<TContext extends MachineContext = Context> = MachineConfig<
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
  Meta
>;

export type TransitionConfigOrTarget<
  TContext extends MachineContext = Context,
> = XStateTransitionConfigOrTarget<
  TContext,
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

export type Meta = {
  customAnalyticsEventName?: string;
  done?: GenericGuard<Context>;
  arrays?: Record<string, ArrayConfigFlow>;
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
  context: Context,
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
  return resolvedState._nodes.find((node) => _.isEqual(node.path, statepath));
};

const isFinalStep = (machine: FlowStateMachine, stepId: string) => {
  const transitions = findNode(machine, stepId)?.transitions;
  return transitions === undefined || !transitions.has("SUBMIT");
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
  const context = (stateNode.machine.config.context ?? {}) as Context;

  const statesWithDoneFunctionOrSubstates = Object.values(
    stateNode.states ?? {},
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
        ?.always?.at(0)
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
  data?: Context;
  guards?: Guards;
}) => {
  const machine = setup({
    types: {} as StateMachineTypes,
    guards,
  }).createMachine({ ...config, context });
  const flowId = config.id ?? "";
  const reachableSteps = getSteps(machine); // depends on context
  const hasDoneFunction =
    metaFromStepId(machine, reachableSteps[0])?.done !== undefined;

  return {
    getMeta: (currentStepId: string) => metaFromStepId(machine, currentStepId),
    getRootMeta: () => rootMeta(machine),
    stepStates: () => stepStates(machine.root, reachableSteps),
    getReachableSteps: () => reachableSteps,
    getUserdata: () => context,
    isDone: (currentStepId: string) =>
      Boolean(
        hasDoneFunction
          ? metaFromStepId(machine, currentStepId)?.done!({ context })
          : false,
      ),
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
