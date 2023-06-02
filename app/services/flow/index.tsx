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

export const isFinalStep = (stepId: string) =>
  getStateMachine().getStateNodeByPath(stepId).type === "final";

export const isStepReachable = (stepId: string, context: any) =>
  Object.values(
    getShortestPaths(getStateMachine(context), {
      events: { SUBMIT: [{ type: "SUBMIT" }] },
    })
  )
    .map(({ state }) => state.value)
    .includes(stepId);

export const getNextStep = (stepId: string, context: any) =>
  getStateMachine(context).transition(stepId, { type: "SUBMIT" }).value;

export const getPreviousStep = (stepId: string, context: any) =>
  getStateMachine(context).transition(stepId, { type: "BACK" }).value;

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
