import type { StepState } from "../flow/server/buildFlowController";

export const subflowDoneStatesFromStepStates = (stepStates: StepState[]) =>
  Object.fromEntries(
    stepStates
      .filter((stepState) => !stepState.excludedFromValidation)
      .map((stepState) => [
        stepState.stepId,
        stepState.isReachable && stepState.isDone,
      ]),
  );
