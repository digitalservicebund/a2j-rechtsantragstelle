import type { MachineConfig } from "xstate";
import { createMachine } from "xstate";
import { getSimplePaths } from "@xstate/graph";
import config from "./beratungshilfe.json";
import { guards } from "./guards";

const initialStateId = config.initial;

export function getStateMachine(stepID: string | undefined, context: any) {
  const stateMachineConfig = {
    ...(config as MachineConfig<any, any, any>),
    predictableActionArguments: true,
    initial: stepID || initialStateId,
    context: { ...context, stepId: stepID },
  };

  return createMachine(stateMachineConfig, {
    guards,
  });
}

export function getInitialStep() {
  return initialStateId;
}

export function isLastStep(stepID: string | undefined) {
  if (!stepID) {
    return false;
  }

  const stateMachine = getStateMachine(stepID, undefined);
  const stateNode = stateMachine.getStateNodeById(
    `${stateMachine.key}.${stepID}`
  );
  return stateNode.type === "final";
}

export function getPreviousStep(stepID: string, context: any) {
  const stateMachine = getStateMachine(stepID, context);
  return stateMachine.transition(stepID, { type: "BACK" }).value;
}

export function hasStep(stepID: string | undefined) {
  if (stepID == undefined) return false;

  const stateMachine = getStateMachine(stepID, undefined);
  return stateMachine.stateIds.includes(`${stateMachine.key}.${stepID}`);
}

export function getNextStep(stepID: string, context: any) {
  const stateMachine = getStateMachine(stepID, context);

  if (!hasStep(stepID)) {
    return stateMachine.initial;
  }

  return stateMachine.transition(stepID, { type: "SUBMIT" }).value;
}

export function getProgressBar(stepID: string, context: any) {
  const stateMachine = getStateMachine(initialStateId, context);
  const steps = Object.values(getSimplePaths(stateMachine)).map(
    ({ state }) => state.value
  );
  const index = steps.indexOf(stepID);
  return { total: steps.length, current: index + 1 };
}
