import type { StateMachine } from "xstate";
import { createMachine } from "xstate";
import config from "./beratungshilfe.json";
import guards from "./guards";

const initialStateId = config.initial;

export function getStateMachine(stepID: string | undefined, context: any) {
  const stateMachineConfig = {
    ...config,
    predictableActionArguments: true,
    initial: stepID || initialStateId,
  };

  const stateMachine = createMachine(stateMachineConfig, {
    guards: guards(stepID || initialStateId, context),
  });

  return stateMachine;
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
  return stateNode.transitions.length === 0;
}

export function getPreviousStep(stepID: string, context: any) {
  const stateMachine = getStateMachine(stepID, context);
  const possiblePreviousSteps = getPossibleParentNodes(
    stateMachine,
    stepID,
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
  stepID: string | undefined,
  context: any
) {
  const possiblePreviousSteps: string[] = [];

  if (!stepID) {
    return possiblePreviousSteps;
  }

  do {
    const step = possiblePreviousSteps.pop() || stepID;
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

export function hasStep(stepID: string | undefined) {
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
  const stateMachine = getStateMachine(initialStateId, context);
  const possiblePaths = getPossiblePath(stateMachine, stepID);
  const longestPossiblePaths = getPossiblePath(stateMachine, initialStateId);

  const progressBar = {
    current: longestPossiblePaths.length - possiblePaths.length,
    total: longestPossiblePaths.length,
  };

  return progressBar;
}
