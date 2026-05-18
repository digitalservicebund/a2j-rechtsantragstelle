import { createNumberIncrementSchema } from "~/services/validation/numberIncrement";

describe("numberIncrement", () => {
  describe("success cases", () => {
    const cases = [
      { input: 0, expected: 0 },
      { input: 5, expected: 5 },
      { input: 3, expected: 3 },
      { input: "", expected: 0 },
      { input: "4", expected: 4 },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = createNumberIncrementSchema(0, 5).safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failure cases", () => {
    const cases = [
      { input: -1, errorMessage: "too_low" },
      { input: 6, errorMessage: "too_high" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, errorMessage }) => {
        const actual = createNumberIncrementSchema(0, 5).safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );
  });
});
