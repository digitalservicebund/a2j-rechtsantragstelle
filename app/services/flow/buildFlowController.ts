import type { MachineConfig } from "xstate";
import { createMachine } from "xstate";
import { getShortestPaths } from "@xstate/graph";

type GetStateMachineArgs = {
  config: MachineConfig<any, any, any>;
  context?: any;
  guards?: any;
};

const getStateMachine = ({ config, context, guards }: GetStateMachineArgs) => {
  const stateMachineConfig = {
    ...config,
    predictableActionArguments: true,
    context,
  };

  return createMachine(stateMachineConfig, { guards });
};

const getSteps = (machine: ReturnType<typeof getStateMachine>) => {
  return Object.values(
    getShortestPaths(machine, {
      events: { SUBMIT: [{ type: "SUBMIT" }] },
    })
  ).map(({ state }) => state.value);
};

const getTransitionDestination = (
  machine: ReturnType<typeof getStateMachine>,
  currentStep: string,
  type: string
) => {
  const transitions = machine.getStateNodeByPath(currentStep).config.on;
  if (!transitions || !(type in transitions))
    throw new Error(
      `No transition of type ${type} defined on step ${currentStep}`
    );
  return machine.transition(currentStep, { type }).value as string;
};

type BuildFlowControllerArgs = {
  flow: MachineConfig<any, any, any>; // TODO correct type
  data?: any; // TODO correct type
  guards?: any;
};

const isFinalStep = (
  machine: ReturnType<typeof getStateMachine>,
  stepId: string
) => {
  const transitions = machine.getStateNodeByPath(stepId).config.on;
  return Boolean(transitions && !("SUBMIT" in transitions));
};

export const buildFlowController = ({
  flow,
  data,
  guards,
}: BuildFlowControllerArgs) => {
  const machine = getStateMachine({
    config: flow,
    context: data,
    guards,
  });

  const baseUrl = flow.id;

  return {
    isInitial: (currentStepId: string) => flow.initial === currentStepId,
    isFinal: (currentStepId: string) => isFinalStep(machine, currentStepId),
    isReachable: (currentStepId: string) =>
      getSteps(machine).includes(currentStepId),
    getPrevious: (currentStepId: string) => {
      const name = getTransitionDestination(machine, currentStepId, "BACK");
      return { name, url: `${baseUrl}${name}` };
    },
    getNext: (currentStepId: string) => {
      const name = getTransitionDestination(machine, currentStepId, "SUBMIT");
      return { name, url: `${baseUrl}${name}` };
    },
    getInitial: () => {
      const name = flow.initial;
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
            .filter((p) => p)
        ) + 1;
      const node = machine.getStateNodeByPath(currentStepId); //TODO: fix type
      const current: number = isFinalStep(machine, currentStepId)
        ? total
        : node.meta?.progressPosition;
      return { total, current };
    },
  };
};
