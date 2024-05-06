import type { MachineConfig } from "xstate";
import {
  getInitialSnapshot,
  getNextSnapshot,
  pathToStateValue,
  setup,
} from "xstate";
import { getShortestPaths } from "@xstate/graph";
import {
  stateValueToStepIds,
  stepIdToPath,
} from "~/services/flow/stepIdConverter";
import type { Context } from "~/models/flows/contexts";
import type { GenericGuard, Guards } from "~/models/flows/guards.server";
import _ from "lodash";
import type { ArrayConfig } from "~/services/array";

type Event = "SUBMIT" | "BACK";
type FlowStateMachineEvents = { type: "SUBMIT" } | { type: "BACK" };

type StateMachineTypes = {
  context: Context;
  events: FlowStateMachineEvents;
};

const genericMachine = setup({
  types: {} as StateMachineTypes,
  guards: {} as Guards,
});

export type FlowStateMachine = ReturnType<typeof genericMachine.createMachine>;

export type Config = MachineConfig<
  Context,
  FlowStateMachineEvents,
  never,
  never,
  { type: string; params: unknown },
  never
>;
type Meta = {
  customAnalyticsEventName?: string;
  progressPosition: number | undefined;
  isUneditable: boolean | undefined;
  done: GenericGuard<Context>;
  arrays?: Record<string, ArrayConfig>;
};

const getSteps = (machine: FlowStateMachine) => {
  // todo: remove machine relying on context passed at createMachine()...
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

  return [
    ...new Set(
      Object.values(possiblePaths)
        .map(({ state }) => stateValueToStepIds(state.value))
        .flat(),
    ),
  ];
};

export const transitionDestinations = (
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
  const destinationState = getNextSnapshot(machine, resolvedState, { type });
  const destinationStepIds = stateValueToStepIds(destinationState.value);

  // If the stepId if the new state matches the previous one: Return undefined. else: return full path
  if (
    destinationStepIds.length === 0 ||
    (destinationStepIds.length === 1 && destinationStepIds[0] === stepId)
  )
    return undefined;
  return destinationStepIds.map(
    (transitionId) => `${machine.id}${transitionId}`,
  );
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
  return !transitions || !transitions.has("SUBMIT");
};

const rootMeta = (machine: FlowStateMachine) => {
  return machine.config?.meta as Meta | undefined;
};

const metaFromStepId = (machine: FlowStateMachine, currentStepId: string) => {
  return findNode(machine, currentStepId)?.meta as Meta | undefined;
};

function getInitial(machine: FlowStateMachine) {
  // The initial state might be nested and needs to be resolved
  const initialSnapshot = getInitialSnapshot(machine);
  return stateValueToStepIds(initialSnapshot.value).pop();
}

export type StepState = {
  stepId: string;
  isDone: boolean;
  isReachable: boolean;
  isUneditable: boolean;
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
    const isUneditable = Boolean(meta?.isUneditable);
    const subStepStates = stepStates(state, reachableSteps);

    // Ignore subflows if empty or parent state has done function
    if (hasDoneFunction || subStepStates.length === 0) {
      const parentInitial = state.config.initial as string | undefined;
      const initialStepId = parentInitial
        ? `${stepId}/${parentInitial}`
        : stepId;

      return {
        url: `${state.machine.id}${initialStepId}`,
        isDone: hasDoneFunction ? meta.done({ context }) : false,
        stepId,
        isUneditable,
        isReachable: reachableSteps.includes(initialStepId),
      };
    }

    const reachableSubStates = subStepStates.filter(
      (state) => state.isReachable,
    );

    return {
      url: `${state.machine.id}${stepId}`,
      isDone: reachableSubStates.every((state) => state.isDone),
      stepId,
      isUneditable,
      isReachable: reachableSubStates.length > 0,
      subStates: subStepStates,
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
  const baseUrl = config.id ?? "";
  const reachableSteps = getSteps(machine); // depends on context

  return {
    getMeta: (currentStepId: string) => metaFromStepId(machine, currentStepId),
    getRootMeta: () => rootMeta(machine),
    stepStates: () => stepStates(machine.root, reachableSteps),
    isDone: (currentStepId: string) =>
      Boolean(metaFromStepId(machine, currentStepId)?.done({ context })),
    isUneditable: (currentStepId: string) =>
      Boolean(metaFromStepId(machine, currentStepId)?.isUneditable),
    getConfig: () => config,
    isFinal: (currentStepId: string) => isFinalStep(machine, currentStepId),
    isReachable: (currentStepId: string) => {
      return reachableSteps.includes(currentStepId);
    },
    getPrevious: (stepId: string) => {
      const backArray = transitionDestinations(
        machine,
        stepId,
        "BACK",
        context,
      );
      if (backArray) return backArray[0];
    },
    getNext: (stepId: string) => {
      const nextArray = transitionDestinations(
        machine,
        stepId,
        "SUBMIT",
        context,
      );
      if (nextArray) return nextArray[0];
    },
    getInitial: () => `${baseUrl}${getInitial(machine) ?? ""}`,
    getProgress: (currentStepId: string) => {
      const max =
        Math.max(
          ...Object.values(machine.states)
            .map((n) => (n.meta as Meta)?.progressPosition ?? 0)
            .filter((p) => p),
        ) + 1;
      const meta = metaFromStepId(machine, currentStepId);
      return { max, progress: meta?.progressPosition ?? max };
    },
  };
};
