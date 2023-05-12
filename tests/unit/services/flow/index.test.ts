import {
  getStateMachine,
  getInitialStep,
  isLastStep,
  getPreviousStep,
  hasStep,
  getNextStep,
} from "~/services/flow";

import config from "~/services/flow/beratungshilfe.json";

// Test getStateMachine
test("getStateMachine should return a valid state machine", () => {
  const stepId = config.initial;
  const context = {};
  const stateMachine = getStateMachine(stepId, context);
  expect(stateMachine).toBeDefined();
});

// Test getInitialStep
test("getInitialStep should return the initial step", () => {
  const initialStep = getInitialStep();
  expect(initialStep).toBe(config.initial);
});

// Test isLastStep
test("isLastStep should return true for the last step", () => {
  const lastStep = "abschlussJa";
  const isLast = isLastStep(lastStep);
  expect(isLast).toBe(true);
});

test("isLastStep should return false for a non-last step", () => {
  const nonLastStep = config.initial;
  const isLast = isLastStep(nonLastStep);
  expect(isLast).toBe(false);
});

// Test hasStep
test("hasStep should return true for an existing step", () => {
  const existingStep = config.initial;
  const hasStepValue = hasStep(existingStep);
  expect(hasStepValue).toBe(true);
});

test("hasStep should return false for a non-existing step", () => {
  const nonExistingStep = "Hermine Granger";
  const hasStepValue = hasStep(nonExistingStep);
  expect(hasStepValue).toBe(false);
});
