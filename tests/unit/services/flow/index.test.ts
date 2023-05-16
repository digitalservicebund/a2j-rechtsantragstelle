import {
  getStateMachine,
  getInitialStep,
  isLastStep,
  getPreviousStep,
  hasStep,
  getNextStep,
  getProgressBar,
} from "~/services/flow";

import config from "~/services/flow/beratungshilfe.json";

test("getStateMachine should return a valid state machine", () => {
  const stepID = config.initial;
  const context = {};
  const stateMachine = getStateMachine(stepID, context);
  expect(stateMachine).toBeDefined();
});

test("getInitialStep should return the initial step", () => {
  const initialStep = getInitialStep();
  expect(initialStep).toBe(config.initial);
});

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

test("getPreviousStep should return previous step", () => {
  const step = "wurdeVerklagt";
  const expected = "rechtsschutzversicherung";
  const next = getPreviousStep(step, {
    rechtsschutzversicherung: { hasRechtsschutzversicherung: "no" },
  });
  expect(next).toBe(expected);
});

test("getPreviousStep should return first step if context is wrong", () => {
  const step = "eigeninitiative";
  const expected = "rechtsschutzversicherung";
  const next = getPreviousStep(step, {});
  expect(next).toBe(expected);
});

test("getNextStep should return next step", () => {
  const step = "rechtsschutzversicherung";
  const expected = "wurdeVerklagt";
  const next = getNextStep(step, {
    rechtsschutzversicherung: { hasRechtsschutzversicherung: "no" },
  });
  expect(next).toBe(expected);
});

test("getNextStep should return first step if no step id provided", () => {
  const expected = "rechtsschutzversicherung";
  const next = getNextStep("", {});
  expect(next).toBe(expected);
});

test("getProgressBar should return progress bar", () => {
  const step = "wurdeVerklagt";
  const context = {
    rechtsschutzversicherung: { hasRechtsschutzversicherung: "no" },
  };
  const progressbar = getProgressBar(step, context);

  expect(progressbar.current).toBe(2);
  expect(progressbar.total).toBe(34);
});
