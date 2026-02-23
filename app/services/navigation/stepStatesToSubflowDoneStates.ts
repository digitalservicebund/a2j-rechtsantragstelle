import type { StepState } from "../flow/server/buildFlowController";

export const stepStatesToSubflowDoneStates = (stepStates: StepState[]) =>
  Object.fromEntries(
    stepStates.map((stepState) => [stepState.stepId, stepState.isDone]),
  );
