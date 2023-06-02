import {
  getStateMachine,
  isFinalStep,
  getPreviousStep,
  isStepReachable,
  getNextStep,
  getProgressBar,
  initialStep,
} from "~/services/flow";

test("getStateMachine should return a valid state machine", () => {
  const context = {};
  const stateMachine = getStateMachine(context);
  expect(stateMachine).toBeDefined();
});

describe("services/flow", () => {
  describe("isFinalStep", () => {
    const examples = [
      { stepId: "weitereZahlungenSummeAbschlussJa", expected: true },
      { stepId: "rechtsschutzversicherungError", expected: true },
      { stepId: "rechtsschutzversicherung", expected: false },
      { stepId: "einkommen", expected: false },
      { stepId: initialStep, expected: false },
    ];

    test.each(examples)(
      "given $stepId, returns $expected",
      ({ stepId, expected }) => {
        expect(isFinalStep(stepId)).toBe(expected);
      }
    );
  });

  describe("isStepReachable", () => {
    const examples = [
      { stepId: initialStep, context: undefined, expected: true },
      {
        stepId: "rechtsschutzversicherungError",
        context: undefined,
        expected: false,
      },
      {
        stepId: "rechtsschutzversicherungError",
        context: {
          rechtsschutzversicherung: { hasRechtsschutzversicherung: "yes" },
        },
        expected: true,
      },
      { stepId: "wurdeVerklagt", context: undefined, expected: false },
      {
        stepId: "wurdeVerklagt",
        context: {
          rechtsschutzversicherung: { hasRechtsschutzversicherung: "no" },
        },
        expected: true,
      },
      { stepId: "klageEingereicht", context: undefined, expected: false },
      {
        stepId: "klageEingereicht",
        context: {
          rechtsschutzversicherung: { hasRechtsschutzversicherung: "no" },
          wurdeVerklagt: { wurdeVerklagt: "no" },
        },
        expected: true,
      },
      {
        stepId: "klageEingereicht",
        context: {
          rechtsschutzversicherung: { hasRechtsschutzversicherung: "no" },
          wurdeVerklagt: { wurdeVerklagt: "yes" },
        },
        expected: false,
      },
      {
        stepId: "weitereZahlungenSummeAbschlussJa",
        context: undefined,
        expected: false,
      },
    ];

    test.each(examples)(
      "given $stepId with $context, returns $expected",
      ({ stepId, context, expected }) => {
        expect(isStepReachable(stepId, context)).toBe(expected);
      }
    );
  });
});

// test("hasStep should return true for an existing step", () => {
//   const existingStep = config.initial;
//   const hasStepValue = hasStep(existingStep);
//   expect(hasStepValue).toBe(true);
// });

// test("hasStep should return false for a non-existing step", () => {
//   const nonExistingStep = "Hermine Granger";
//   const hasStepValue = hasStep(nonExistingStep);
//   expect(hasStepValue).toBe(false);
// });

test("getPreviousStep should return previous step", () => {
  const step = "wurdeVerklagt";
  const expected = "rechtsschutzversicherung";
  const next = getPreviousStep(step, {
    rechtsschutzversicherung: { hasRechtsschutzversicherung: "no" },
  });
  expect(next).toBe(expected);
});

test.skip("getPreviousStep should return first step if context is wrong", () => {
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

test.skip("getNextStep should return first step if no step id provided", () => {
  const expected = "rechtsschutzversicherung";
  const next = getNextStep("", {});
  expect(next).toBe(expected);
});

test.skip("getProgressBar should return progress bar", () => {
  const step = "wurdeVerklagt";
  const context = {
    rechtsschutzversicherung: { hasRechtsschutzversicherung: "no" },
  };
  const progressbar = getProgressBar(step, context);

  expect(progressbar.current).toBe(2);
  expect(progressbar.total).toBe(17);
});
