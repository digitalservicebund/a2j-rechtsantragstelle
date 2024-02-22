import type { MachineConfig } from "xstate";
import { getNextSnapshot, setup } from "xstate";
import { getShortestPaths } from "@xstate/graph";
import { getStateValueString } from "~/services/flow/getStateValueString";
import type { Context } from "~/models/flows/contexts";
import type { SubflowState } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

type Event = "SUBMIT" | "BACK";
type StateMachineEvents = { type: "SUBMIT" } | { type: "BACK" };

const stateMachineTypes = {
  context: {} as Context,
  events: {} as StateMachineEvents,
};
const genericMachine = setup({ types: stateMachineTypes });
type StateMachine = typeof genericMachine.createMachine;

export type Config = MachineConfig<Context, StateMachineEvents>;

export type Guards = Record<
  string,
  ({ context }: { context: Context }) => boolean
>;
export type Meta = {
  customEventName?: string;
  progressPosition: number | undefined;
  isUneditable: boolean | undefined;
  done: (context: Context) => boolean | undefined;
  subflowState: (context: Context, subflowId: string) => SubflowState;
  subflowDone: (context: Context, subflowId: string) => boolean | undefined;
};

function getStateNodeByPath(machine: StateMachine, stepId: string) {
  return Object.values(machine.states).find((state) => state.key === stepId);
}

const getSteps = (machine: StateMachine) => {
  return Object.values(
    getShortestPaths(machine, { events: [{ type: "SUBMIT" }] }),
  ).map(({ state }) => getStateValueString(state.value));
};

const getTransitionDestination = (
  machine: StateMachine,
  currentStep: string,
  type: Event,
) => {
  const transitions = getStateNodeByPath(machine, currentStep).config.on;
  if (!transitions || !(type in transitions))
    throw new Error(
      `No transition of type ${type} defined on step ${currentStep}`,
    );

  // if (!transitions || !(type in transitions)) return undefined;
  const nextState = getNextSnapshot(
    machine,
    machine.resolveState({ value: currentStep }),
    { type },
  );
  return getStateValueString(nextState.value);
};

const isFinalStep = (machine: StateMachine, stepId: string) => {
  const transitions = getStateNodeByPath(machine, stepId).config.on;
  return Boolean(
    transitions &&
      (!("SUBMIT" in transitions) ||
        JSON.stringify(transitions["SUBMIT"]) == "{}" ||
        JSON.stringify(transitions["SUBMIT"]) == "[]"),
  );
};

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
    types: stateMachineTypes,
    guards,
  }).createMachine({ ...config, context });
  const baseUrl = config.id ?? "";
  const initialStepId = getStateValueString(machine.getInitialSnapshot().value);
  const normalizeStepId = (stepId: string) =>
    stepId.replace(/\//g, ".").replace("ergebnis.", "ergebnis/");
  const denormalizeStepId = (stepId: string) => stepId.replace(/\./g, "/");
  const isInitialStepId = (currentStepId: string) =>
    initialStepId === normalizeStepId(currentStepId);

  const getMeta = (currentStepId: string): Meta | undefined =>
    getStateNodeByPath(machine, normalizeStepId(currentStepId)).meta;

  return {
    getMeta,
    isDone: (currentStepId: string) =>
      Boolean(getMeta(currentStepId)?.done(context)),
    getSubflowState: (currentStepId: string, subflowId: string) =>
      getMeta(currentStepId)?.subflowState(context, subflowId),
    isUneditable: (currentStepId: string) =>
      Boolean(getMeta(currentStepId)?.isUneditable),
    getConfig: () => config,
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
      if (!name) return undefined;
      return { name, url: `${baseUrl}${denormalizeStepId(name)}` };
    },
    getNext: (currentStepId: string) => {
      const name = getTransitionDestination(
        machine,
        normalizeStepId(currentStepId),
        "SUBMIT",
      );
      if (!name) return undefined;
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
      const node = getStateNodeByPath(machine, stepId);
      const current = isFinalStep(machine, stepId)
        ? total
        : (node.meta as Meta)?.progressPosition ?? 0;
      return { total, current };
    },
  };
};
