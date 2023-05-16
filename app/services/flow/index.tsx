import type { StateMachine } from "xstate";
import { createMachine, StateNode } from "xstate";
import config from "./beratungshilfe.json";
import guards from "./guards";

const initialStateId = config.initial;

export function getStateMachine(stepId: string | undefined, context: any) {
  const stateMachineConfig = {
    ...config,
    predictableActionArguments: true,
    initial: stepId || initialStateId,
  };

  const stateMachine = createMachine(stateMachineConfig, {
    guards: guards(stepId || initialStateId, context),
  });

  return stateMachine;
}

export function getInitialStep() {
  return initialStateId;
}

export function isLastStep(stepId: string | undefined) {
  if (!stepId) {
    return false;
  }

  const stateMachine = getStateMachine(stepId, undefined);
  const stateNode = stateMachine.getStateNodeById(
    `${stateMachine.key}.${stepId}`
  );
  return stateNode.transitions.length === 0;
}

export function getPreviousStep(stepId: string, context: any) {
  const stateMachine = getStateMachine(stepId, context);
  const possiblePreviousSteps = getPossibleParentNodes(
    stateMachine,
    stepId,
    context
  );

  let result: string | undefined = undefined;

  if (possiblePreviousSteps.length > 1) {
    for (const previousStep of possiblePreviousSteps) {
      let previousSteps = [previousStep];

      do {
        previousSteps = previousSteps.concat(
          getPossibleParentNodes(stateMachine, previousSteps.pop()!, context)
        );
      } while (previousSteps.length > 1);

      if (previousStep.length === 1) {
        result = previousStep;
        break;
      }
    }
  } else if (possiblePreviousSteps.length === 1) {
    result = possiblePreviousSteps[0];
  }

  if (!result) {
    result = getInitialStep();
  }

  return result;
}

function getPossibleParentNodes(
  stateMachine: StateMachine<any, any, any>,
  stepId: string | undefined,
  context: any
) {
  const possiblePreviousSteps: string[] = [];

  if (!stepId) {
    return possiblePreviousSteps;
  }

  do {
    const step = possiblePreviousSteps.pop() || stepId;
    for (const state in stateMachine.states) {
      const stateNode = stateMachine.getStateNodeById(
        `${stateMachine.key}.${state}`
      );
      stateNode.transitions.forEach((transition) => {
        if (
          transition.target?.some((target) => target.key === step) &&
          !possiblePreviousSteps.includes(transition.source.key)
        ) {
          const next = getNextStep(transition.source.key, context);
          if (next === step) {
            possiblePreviousSteps.push(transition.source.key);
          }
        }
      });
    }
  } while (possiblePreviousSteps.length > 1);

  return possiblePreviousSteps;
}

export function hasStep(stepId: string | undefined) {
  const stateMachine = getStateMachine(stepId, undefined);

  return stateMachine.stateIds.includes(`${stateMachine.key}.${stepId}`);
}

export function getNextStep(stepId: string, context: any) {
  const stateMachine = getStateMachine(stepId, context);

  if (!hasStep(stepId)) {
    return stateMachine.initial;
  }

  return stateMachine.transition(stepId, { type: "SUBMIT" }).value;
}

function getPossiblePath(
  stateMachine: StateMachine<any, any, any>,
  searchStepId: string
) {
  const possiblePaths: string[] = [];
  const stack: { node: any; currentStepId?: string }[] = [];

  const initialStateNode = stateMachine.getStateNodeById(
    `${stateMachine.key}.${searchStepId}`
  );
  stack.push({ node: initialStateNode });

  while (stack.length > 0) {
    const { node, currentStepId } = stack.pop()!;
    if (currentStepId && !possiblePaths.includes(currentStepId)) {
      possiblePaths.push(currentStepId);
    }

    for (const transition of node.transitions) {
      if (transition.target) {
        for (const target of transition.target) {
          stack.push({ node: target, currentStepId: target.key });
        }
      }
    }
  }

  return possiblePaths;
}

export function getProgressBar(stepId: string, context: any) {
  const stateMachine = getStateMachine(initialStateId, context);
  const possiblePaths = getPossiblePath(stateMachine, stepId);
  const longestPossiblePaths = getPossiblePath(stateMachine, initialStateId);

  const progressBar = {
    current: longestPossiblePaths.length - possiblePaths.length,
    total: longestPossiblePaths.length,
  };

  return progressBar;
}
