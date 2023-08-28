import type { MachineConfig } from "xstate";
import { createMachine } from "xstate";
import { getShortestPaths } from "@xstate/graph";

type Context = Record<string, boolean | string | object>;
type Event = "SUBMIT" | "BACK";
type StateMachineEvents = { type: "SUBMIT" } | { type: "BACK" };
type StateMachine = ReturnType<
  typeof createMachine<Context, StateMachineEvents>
>;
type Config = MachineConfig<Context, any, StateMachineEvents>;
type Guards = Record<string, (context: Context) => boolean>;

const getSteps = (machine: StateMachine) => {
  return Object.values(
    getShortestPaths(machine, { events: { SUBMIT: [{ type: "SUBMIT" }] } }),
  ).map(({ state }) => state.value);
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
  return machine.transition(currentStep, { type }).value as string;
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
  const baseUrl = config.id;

  return {
    isInitial: (currentStepId: string) => config.initial === currentStepId,
    isFinal: (currentStepId: string) => isFinalStep(machine, currentStepId),
    isReachable: (currentStepId: string) =>
      getSteps(machine).includes(currentStepId),
    getPrevious: (currentStepId: string) => {
      if (config.initial === currentStepId) return undefined;
      const name = getTransitionDestination(machine, currentStepId, "BACK");
      return { name, url: `${baseUrl}${name}` };
    },
    getNext: (currentStepId: string) => {
      const name = getTransitionDestination(machine, currentStepId, "SUBMIT");
      return { name, url: `${baseUrl}${name}` };
    },
    getInitial: () => {
      const name = config.initial;
      return { name, url: `${baseUrl}${String(name)}` };
    },
    getLastReachable: () => {
      const name = getSteps(machine).at(-1);
      return { name, url: `${baseUrl}${String(name)}` };
    },
    getProgress: (currentStepId: string) => {
      const total =
        Math.max(
          ...Object.values(machine.states)
            .map((n) => n.meta?.progressPosition)
            .filter((p) => p),
        ) + 1;
      const node = machine.getStateNodeByPath(currentStepId); //TODO: fix type
      const current: number = isFinalStep(machine, currentStepId)
        ? total
        : node.meta?.progressPosition;
      return { total, current };
    },
  };
};
