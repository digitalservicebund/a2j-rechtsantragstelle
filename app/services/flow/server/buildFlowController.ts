import type { MachineConfig } from "xstate";
import {
  createActor,
  createMachine,
  getNextSnapshot,
  pathToStateValue,
  setup,
} from "xstate";
import { getShortestPaths } from "@xstate/graph";
import {
  getStateValueString,
  stepIdToPath,
} from "~/services/flow/getStateValueString";
import type { Context } from "~/models/flows/contexts";
import type { SubflowState } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";
import type { Guards } from "~/models/flows/guards.server";
import _ from "lodash";

type Event = "SUBMIT" | "BACK";
type StateMachineEvents = { type: "SUBMIT" } | { type: "BACK" };

const stateMachineTypes = {
  context: {} as Context,
  events: {} as StateMachineEvents,
  input: {} as Context,
};
const genericMachine = setup({ types: stateMachineTypes });
type StateMachine = typeof genericMachine.createMachine;

export type Config = MachineConfig<Context, StateMachineEvents>;

export type Meta = {
  customEventName?: string;
  progressPosition: number | undefined;
  isUneditable: boolean | undefined;
  done: (context: Context) => boolean | undefined;
  subflowState: (context: Context, subflowId: string) => SubflowState;
  subflowDone: (context: Context, subflowId: string) => boolean | undefined;
};

const getSteps = (machine: StateMachine, context: Context) => {
  // todo: remove machine relying on context passed at createMachine()...
  // https://www.jsdocs.io/package/xstate#StateMachine.provide is supposed to allow this but context isn't applied
  // idea: machine.provide() with action that assigns the new context
  const possiblePaths = getShortestPaths(machine, {
    events: [{ type: "SUBMIT" }],
  });
  return Object.values(possiblePaths).map(({ state }) =>
    getStateValueString(state.value),
  );
};

const transitionDestination = (
  machine: StateMachine,
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
  const nextStateId = getStateValueString(nextState.value);
  // If the stepId if the new state matches the previous one: Return undefined. else: return full path
  return nextStateId == stepId ? undefined : `${machine.id}${nextStateId}`;
};

const findNode = (machine: StateMachine, stepId: string) => {
  const statepath = stepIdToPath(stepId);
  const resolvedState = machine.resolveState({
    value: pathToStateValue(statepath),
    context: {},
  });
  return resolvedState._nodes.find((node) => _.isEqual(node.path, statepath));
};

const isFinalStep = (machine: StateMachine, stepId: string) => {
  const transitions = findNode(machine, stepId)?.transitions;
  return transitions && !transitions.has("SUBMIT");
};

const metaFromStepId = (machine: StateMachine, currentStepId: string) => {
  return findNode(machine, currentStepId)?.meta as Meta | undefined;
};

function getInitial(machine: StateMachine) {
  return machine.config.initial;
}

export const buildFlowController = ({
  config,
  data: context = {},
  guards,
}: {
  config: Config;
  data?: Context;
  guards?: Guards; // TODO: non-optional?
}) => {
  const machine = setup({
    types: stateMachineTypes,
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
      const total =
        Math.max(
          ...Object.values(machine.states)
            .map((n) => (n.meta as Meta)?.progressPosition ?? 0)
            .filter((p) => p),
        ) + 1;
      const meta = metaFromStepId(machine, currentStepId);
      return { total, current: meta?.progressPosition ?? 0 };
    },
  };
};
