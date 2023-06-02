import type { MachineConfig } from "xstate";
import { createMachine } from "xstate";
import { getSimplePaths, getShortestPaths } from "@xstate/graph";
import { guards } from "./guards";
import config from "./beratungshilfe.json";
import _ from "lodash";

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

export const isStepReachable = (stepId: string, context: any) => {
  const steps = Object.values(
    getShortestPaths(getStateMachine(context), {
      events: { SUBMIT: [{ type: "SUBMIT" }] },
    })
  ).map(({ state }) => state.value);

  console.log(stepId, { steps }, { context });

  return steps.includes(stepId);
};

export const getNextStep = (stepId: string, context: any) =>
  getStateMachine(context).transition(stepId, { type: "SUBMIT" }).value;

export const getPreviousStep = (stepId: string, context: any) =>
  getStateMachine(context).transition(stepId, { type: "BACK" }).value;

export const getProgressBar = (stepId: string, context: any) => {
  const allReachableSteps = Object.values(
    getSimplePaths(getStateMachine(context))
  ).map(({ state }) => state.value);
  return {
    total: allReachableSteps.length,
    current: allReachableSteps.indexOf(stepId) + 1,
  };
};
