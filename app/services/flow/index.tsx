import type { StateMachine } from "xstate";
import { createMachine } from "xstate";
import config from "./beratungshilfe.json";
import guards from "./guards";

export function getStateMachine(stepId: string | undefined, context: any) {
  const stateMachineConfig = {
    ...config,
    predictableActionArguments: true,
    initial: stepId !== undefined ? stepId : config.initial,
  };

  const stateMachine = createMachine(stateMachineConfig, {
    guards: {
      ...guards(stepId || config.initial, context),
    },
  });

  return stateMachine;
}

export function getInitialStep() {
  return config.initial;
}

export function isLastStep(stepId: string | undefined) {
  if (stepId === undefined) {
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

  let result = stepId;

  // multiple previous steps found
  if (possiblePreviousSteps.length > 1) {
    for (const previousStep of possiblePreviousSteps) {
      let previousSteps = [previousStep];

      do {
        previousSteps = previousSteps.concat(
          getPossibleParentNodes(stateMachine, previousSteps.pop(), context)
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

  return result;
}

function getPossibleParentNodes(
  stateMachine: StateMachine<any, any, any>,
  stepId: string | undefined,
  context: any
) {
  const possiblePreviousSteps: string[] = [];

  if (stepId === undefined) {
    return possiblePreviousSteps;
  }

  do {
    const step = possiblePreviousSteps.pop() || stepId;
    for (const state in stateMachine.states) {
      stateMachine
        .getStateNodeById(`${stateMachine.key}.${state}`)
        .transitions.forEach((transition) => {
          if (
            transition.target?.map((target) => target.key).includes(step) &&
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

  return getStateMachine(stepId, undefined).stateIds.includes(
    `${stateMachine.key}.${stepId}`
  );
}

export function getNextStep(stepId: string, context: any) {
  const stateMachine = getStateMachine(stepId, context);

  if (stepId === undefined) {
    return stateMachine.initial;
  }

  return stateMachine.transition(stepId, { type: "SUBMIT" }).value;
}
