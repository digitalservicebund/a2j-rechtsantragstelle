import type { MachineConfig } from "xstate";
import { createMachine } from "xstate";
import { getShortestPaths } from "@xstate/graph";
import { getStateValueString } from "~/services/flow/getStateValueString";

export type Context = Record<string, boolean | string | object | number>;
type Event = "SUBMIT" | "BACK";
type StateMachineEvents = { type: "SUBMIT" } | { type: "BACK" };
type StateMachine = ReturnType<
  typeof createMachine<Context, StateMachineEvents>
>;
export type Config = MachineConfig<Context, any, StateMachineEvents>;
export type Guards = Record<string, (context: Context) => boolean>;
export type Meta = {
  customEventName?: string;
  progressPosition: number | undefined;
  isUneditable: boolean | undefined;
  done: (context: Context) => boolean | undefined;
  buttonNavigationProps?: {
    next?: {
      destination?: string;
      downloadFile?: string;
    };
  };
};

const getSteps = (machine: StateMachine) => {
  return Object.values(
    getShortestPaths(machine, { events: { SUBMIT: [{ type: "SUBMIT" }] } }),
  ).map(({ state }) => getStateValueString(state.value));
};

const getTransitionDestination = (
  machine: StateMachine,
  currentStep: string,
  type: Event,
) => {
  const transitions = machine.getStateNodeByPath(currentStep).config.on;
  if (!transitions || !(type in transitions))
    throw new Error(
      `No transition of type ${type} defined on step ${currentStep}`,
    );
  return getStateValueString(machine.transition(currentStep, { type }).value);
};

const isFinalStep = (machine: StateMachine, stepId: string) => {
  const transitions = machine.getStateNodeByPath(stepId).config.on;
  return Boolean(
    transitions &&
      (!("SUBMIT" in transitions) ||
        JSON.stringify(transitions["SUBMIT"]) == "{}" ||
        JSON.stringify(transitions["SUBMIT"]) == "[]"),
  );
};

export const buildFlowController = ({
  flow: config,
  data: context = {},
  guards,
}: {
  flow: Config;
  data?: Context;
  guards?: Guards;
}) => {
  const machine = createMachine({ ...config, context }, { guards });
  const baseUrl = config.id ?? "";
  const initialStepId = getStateValueString(machine.initialState.value);
  const normalizeStepId = (stepId: string) =>
    stepId.replace(/\//g, ".").replace("ergebnis.", "ergebnis/");
  const denormalizeStepId = (stepId: string) => stepId.replace(/\./g, "/");
  const isInitialStepId = (currentStepId: string) =>
    initialStepId === normalizeStepId(currentStepId);

  const getMeta = (currentStepId: string): Meta | undefined =>
    machine.getStateNodeByPath(normalizeStepId(currentStepId)).meta;

  return {
    getMeta,
    isDone: (currentStepId: string) =>
      Boolean(getMeta(currentStepId)?.done(context)),
    isUneditable: (currentStepId: string) =>
      Boolean(getMeta(currentStepId)?.isUneditable),
    getFlow: () => config,
    isInitial: isInitialStepId,
    isFinal: (currentStepId: string) =>
      isFinalStep(machine, normalizeStepId(currentStepId)),
    isReachable: (currentStepId: string) => {
      return getSteps(machine).includes(normalizeStepId(currentStepId));
    },
    getPrevious: (currentStepId: string) => {
      const stepId = normalizeStepId(currentStepId);
      if (isInitialStepId(stepId)) return undefined;
      const name = getTransitionDestination(machine, stepId, "BACK");
      return { name, url: `${baseUrl}${denormalizeStepId(name)}` };
    },
    getNext: (currentStepId: string) => {
      const name = getTransitionDestination(
        machine,
        normalizeStepId(currentStepId),
        "SUBMIT",
      );
      return { name, url: `${baseUrl}${denormalizeStepId(name)}` };
    },
    getInitial: () => {
      const name = initialStepId;
      return { name, url: `${baseUrl}${denormalizeStepId(String(name))}` };
    },
    getLastReachable: () => {
      const name = getSteps(machine).at(-1);
      return { name, url: `${baseUrl}${denormalizeStepId(String(name))}` };
    },
    getProgress: (currentStepId: string) => {
      const stepId = normalizeStepId(currentStepId);
      const total =
        Math.max(
          ...Object.values(machine.states)
            .map((n) => (n.meta as Meta)?.progressPosition ?? 0)
            .filter((p) => p),
        ) + 1;
      const node = machine.getStateNodeByPath(stepId);
      const current = isFinalStep(machine, stepId)
        ? total
        : (node.meta as Meta)?.progressPosition ?? 0;
      return { total, current };
    },
  };
};
