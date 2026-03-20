import type { StepState } from "../flow/server/buildFlowController";

export const stepStatesToSubflowDoneStates = (
  stepStates: StepState[],
): Record<string, boolean> =>
  Object.fromEntries(
    stepStates.flatMap((stepState) => [
      [stepState.stepId, stepState.isDone],
      ...(stepState.subStates
        ? Object.entries(stepStatesToSubflowDoneStates(stepState.subStates))
        : []),
    ]),
  );
