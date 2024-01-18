import type { SafeParseError } from "zod";
import { integerSchema } from "~/services/validation/integer";

describe("integer", () => {
  describe("success cases", () => {
    const cases = [
      { input: " 100  ", expected: 100 },
      { input: "1000", expected: 1000 },
      { input: "1.000", expected: 1000 },
      { input: "1.000.000", expected: 1000000 },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = integerSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "required" },
      { input: "    ", errorMessage: "required" },
      { input: "1.0", errorMessage: "invalidInteger" },
      { input: "1000.0", errorMessage: "invalidInteger" },
      { input: "1000,0", errorMessage: "invalidInteger" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = integerSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(
          (actual as SafeParseError<unknown>).error.issues[0].message,
        ).toBe(errorMessage);
      },
    );
  });
});
