import type { MachineConfig, StateMachine } from "xstate";
import { createMachine } from "xstate";
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

function getPossiblePath(
  stateMachine: StateMachine<any, any, any>,
  searchStepID: string
) {
  const possiblePaths: string[] = [];
  const stack: { node: any; currentStepID?: string }[] = [];

  const initialStateNode = stateMachine.getStateNodeById(
    `${stateMachine.key}.${searchStepID}`
  );
  stack.push({ node: initialStateNode });

  while (stack.length > 0) {
    const { node, currentStepID } = stack.pop()!;
    if (currentStepID && !possiblePaths.includes(currentStepID)) {
      possiblePaths.push(currentStepID);
    }

    for (const transition of node.transitions) {
      if (transition.target) {
        for (const target of transition.target) {
          stack.push({ node: target, currentStepID: target.key });
        }
      }
    }
  }

  return possiblePaths;
}

export function getProgressBar(stepID: string, context: any) {
  // TODO: fix
  return { total: 43, current: 2 };
  const stateMachine = getStateMachine(initialStateId, context);
  const possiblePaths = getPossiblePath(stateMachine, stepID);
  const longestPossiblePaths = getPossiblePath(stateMachine, initialStateId);

  return {
    current: longestPossiblePaths.length - possiblePaths.length,
    total: longestPossiblePaths.length,
  };
}
