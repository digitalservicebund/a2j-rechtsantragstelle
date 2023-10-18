import { postcodeSchema } from "~/services/validation/postcode";
import type { SafeParseError } from "zod";

describe("postcode validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: "01067", expected: "01067" },
      { input: "99998", expected: "99998" },
      { input: " 12345  ", expected: "12345" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = postcodeSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "length" },
      { input: "abcde", errorMessage: "invalid" },
      { input: "99999", errorMessage: "invalid" },
      { input: "01066", errorMessage: "invalid" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = postcodeSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(
          (actual as SafeParseError<unknown>).error.issues[0].message,
        ).toBe(errorMessage);
      },
    );
  });
});
