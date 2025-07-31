import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";

describe("money validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: "1", expected: "1,00" },
      { input: " 1 ", expected: "1,00" },
      { input: " 1 000", expected: "1.000,00" },
      { input: " 1 00 0", expected: "1.000,00" },
      { input: "1,000.9", expected: "1.000,90" },
      { input: "00000", expected: "0,00" },
      { input: "999999999", expected: "999.999.999,00" },
      { input: "-0", expected: "0,00" },
      { input: "-123", expected: "-123,00" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = buildMoneyValidationSchema({
          min: Number.MIN_SAFE_INTEGER,
        }).safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "required" },
      { input: "  ", errorMessage: "required" },
      { input: "foobar", errorMessage: "wrong_format" },
      { input: "3 thousand", errorMessage: "wrong_format" },
      { input: "123,123,", errorMessage: "wrong_format" },
      { input: "2000000", errorMessage: "too_much" },
      { input: "-2000000", errorMessage: "too_little" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = buildMoneyValidationSchema({
          min: -1000000,
          max: 1000000,
        }).safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );
  });
});
