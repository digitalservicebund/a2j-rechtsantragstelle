import type { MachineConfig } from "xstate";
import {
  getInitialSnapshot,
  getNextSnapshot,
  pathToStateValue,
  setup,
} from "xstate";
import { getShortestPaths } from "@xstate/graph";
import {
  stateValueToStepId,
  stepIdToPath,
} from "~/services/flow/stepIdConverter";
import type { Context } from "~/models/flows/contexts";
import type { SubflowState } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";
import type { Guards } from "~/models/flows/guards.server";
import _ from "lodash";

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
  done: (context: Context) => boolean | undefined;
  subflowState: (context: Context, subflowId: string) => SubflowState;
  subflowDone: (context: Context, subflowId: string) => boolean | undefined;
};

const getSteps = (machine: FlowStateMachine, context: Context) => {
  // todo: remove machine relying on context passed at createMachine()...
  // https://www.jsdocs.io/package/xstate#FlowStateMachine.provide is supposed to allow this but context isn't applied
  // idea: machine.provide() with action that assigns the new context
  const possiblePaths = getShortestPaths(machine, {
    events: [{ type: "SUBMIT" }],
  });
  return Object.values(possiblePaths).map(({ state }) =>
    stateValueToStepId(state.value),
  );
};

export const transitionDestination = (
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
  const nextState = getNextSnapshot(machine, resolvedState, { type });
  const nextStateId = stateValueToStepId(nextState.value);
  // If the stepId if the new state matches the previous one: Return undefined. else: return full path
  return nextStateId == stepId ? undefined : `${machine.id}${nextStateId}`;
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

const metaFromStepId = (machine: FlowStateMachine, currentStepId: string) => {
  return findNode(machine, currentStepId)?.meta as Meta | undefined;
};

function getInitial(machine: FlowStateMachine) {
  // The initial state might be nested and needs to be resolved
  const initialSnapshot = getInitialSnapshot(machine);
  return stateValueToStepId(initialSnapshot.value);
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

  return {
    getMeta: (currentStepId: string) => metaFromStepId(machine, currentStepId),
    isDone: (currentStepId: string) =>
      Boolean(metaFromStepId(machine, currentStepId)?.done(context)),
    getSubflowState: (currentStepId: string, subflowId: string) =>
      metaFromStepId(machine, currentStepId)?.subflowState(context, subflowId),
    isUneditable: (currentStepId: string) =>
      Boolean(metaFromStepId(machine, currentStepId)?.isUneditable),
    getConfig: () => config,
    isFinal: (currentStepId: string) => isFinalStep(machine, currentStepId),
    isReachable: (currentStepId: string) => {
      // depends on context
      return getSteps(machine, context).includes(currentStepId);
    },
    getPrevious: (stepId: string) => {
      return transitionDestination(machine, stepId, "BACK", context);
    },
    getNext: (stepId: string) => {
      return transitionDestination(machine, stepId, "SUBMIT", context);
    },
    getInitial: () => `${baseUrl}${getInitial(machine)}`,
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
