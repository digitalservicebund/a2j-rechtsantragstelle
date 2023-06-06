import {
  getNextStep,
  getPreviousStep,
  getProgressBar,
  getStateMachine,
  initialStep,
  isFinalStep,
  isStepReachable,
} from "~/services/flow";

describe("services/flow", () => {
  const stepExpectationString =
    "given $stepId with $context, returns $expected";

  describe("getStateMachine", () => {
    test("should return a valid state machine", () => {
      expect(getStateMachine()).toBeDefined();
    });
  });

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
      stepExpectationString,
      ({ stepId, context, expected }) => {
        expect(isStepReachable(stepId, context)).toBe(expected);
      }
    );
  });

  describe("getNextStep", () => {
    const examples = [
      {
        stepId: "rechtsschutzversicherung",
        context: {
          rechtsschutzversicherung: { hasRechtsschutzversicherung: "yes" },
        },
        expected: "rechtsschutzversicherungError",
      },
      {
        stepId: "rechtsschutzversicherung",
        context: {
          rechtsschutzversicherung: { hasRechtsschutzversicherung: "no" },
        },
        expected: "wurdeVerklagt",
      },
    ];

    test.each(examples)(
      stepExpectationString,
      ({ stepId, context, expected }) => {
        expect(getNextStep(stepId, context)).toBe(expected);
      }
    );
  });

  describe("getPreviousStep", () => {
    const examples = [
      {
        stepId: "rechtsschutzversicherungError",
        context: undefined,
        expected: "rechtsschutzversicherung",
      },
      {
        stepId: "wurdeVerklagt",
        context: undefined,
        expected: "rechtsschutzversicherung",
      },
    ];

    test.each(examples)(
      stepExpectationString,
      ({ stepId, context, expected }) => {
        expect(getPreviousStep(stepId, context)).toBe(expected);
      }
    );
  });

  describe("getProgressBar", () => {
    test("with a regular step", () => {
      const { current, total } = getProgressBar("wurdeVerklagt");
      expect(current).toBe(2);
      expect(total).toBe(23);
    });

    test("with a final step", () => {
      const { current, total } = getProgressBar(
        "rechtsschutzversicherungError"
      );
      expect(current).toBe(23);
      expect(total).toBe(23);
    });
  });
});
