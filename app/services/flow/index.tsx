import type { MachineConfig } from "xstate";
import { createMachine } from "xstate";
import { getShortestPaths } from "@xstate/graph";
import { guards } from "./guards";
import config from "./beratungshilfe.json";

export const initialStep = config.initial;

export function getStateMachine(context?: any) {
  const stateMachineConfig = {
    ...(config as MachineConfig<any, any, any>),
    predictableActionArguments: true,
    context,
  };

  return createMachine(stateMachineConfig, {
    guards,
  });
}

const getSteps = (context: any) => {
  return Object.values(
    getShortestPaths(getStateMachine(context), {
      events: { SUBMIT: [{ type: "SUBMIT" }] },
    })
  ).map(({ state }) => state.value);
};

export const isFinalStep = (stepId: string) =>
  getStateMachine().getStateNodeByPath(stepId).type === "final";

export const isStepReachable = (stepId: string, context: any) =>
  getSteps(context).includes(stepId);

export const getNextStep = (stepId: string, context: any) =>
  getStateMachine(context).transition(stepId, { type: "SUBMIT" })
    .value as string;

export const getPreviousStep = (stepId: string, context: any) =>
  getStateMachine(context).transition(stepId, { type: "BACK" }).value as string;

export const getLastReachableStep = (context: any) => getSteps(context).at(-1);

export const getProgressBar = (stepId: string) => {
  const machine = getStateMachine();
  const total =
    Math.max(
      ...Object.values(machine.states)
        .map((n) => n.meta?.progressPosition)
        .filter((p) => p)
    ) + 1;
  const node = machine.getStateNodeByPath(stepId);
  const current = node.type === "final" ? total : node.meta?.progressPosition;
  return { current, total };
};

export const getStepUrl = (stepId: string) =>
  `/beratungshilfe/vorabcheck/${stepId}`;
