import type { StateMachine } from "xstate";
import { createMachine } from "xstate";
import config from "./beratungshilfe.json";
import guards from "./guards";

function getStateMachine(stepId: string | undefined, context: any) {
  let stateMachineConfig = {
    ...config,
    predictableActionArguments: true,
  };
  if (stepId !== undefined) {
    stateMachineConfig.initial = stepId;
  } else {
    stepId = config.initial;
  }
  const stateMachine = createMachine(
    {
      ...stateMachineConfig,
    },
    {
      guards: {
        ...guards(stepId, context),
      },
    }
  );

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
  return (
    stateMachine.getStateNodeById(`${stateMachine.key}.${stepId}`).transitions
      .length === 0
  );
}

export function getPreviousStep(stepId: string, context: any) {
  let stateMachine = getStateMachine(stepId, context);

  let possiblePreviousSteps = getPossiblePreviousSteps(
    stateMachine,
    stepId,
    context
  );

  return possiblePreviousSteps;
}

function getPossiblePreviousSteps(
  stateMachine: StateMachine<any, any, any>,
  stepId: string,
  context: any
) {
  let possiblePreviousSteps: string[] = getPossibleParentNodes(
    stateMachine,
    stepId,
    context
  );

  let result = stepId;

  // multiple previous steps found
  if (possiblePreviousSteps.length > 1) {
    for (const previousStep in possiblePreviousSteps) {
      let previousSteps: string[] = [previousStep];

      do {
        previousSteps = previousSteps.concat(
          getPossibleParentNodes(stateMachine, previousSteps.pop(), context)
        );
      } while (previousSteps.length > 1);

      if (previousStep.length == 1) {
        result = previousStep;
        break;
      }
    }
  }

  if (possiblePreviousSteps.length === 1) {
    result = possiblePreviousSteps[0];
  }

  return result;
}

function getPossibleParentNodes(
  stateMachine: StateMachine<any, any, any>,
  stepId: string | undefined,
  context: any
) {
  let possiblePreviousSteps: string[] = [];

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
            let next = getNextStep(transition.source.key, context);

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
