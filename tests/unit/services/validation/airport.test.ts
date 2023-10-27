import { airportSchema } from "~/services/validation/airport";
import type { SafeParseError } from "zod";

describe("airport validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: " abc ", expected: "ABC" },
      { input: "Bar", expected: "BAR" },
      { input: " fOo ", expected: "FOO" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = airportSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "wrong_airport_format" },
      { input: "ab", errorMessage: "wrong_airport_format" },
      { input: "123", errorMessage: "wrong_airport_format" },
      { input: " :) ", errorMessage: "wrong_airport_format" },
      { input: "foobar ", errorMessage: "wrong_airport_format" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = airportSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(
          (actual as SafeParseError<unknown>).error.issues[0].message,
        ).toBe(errorMessage);
      },
    );
  });
});
