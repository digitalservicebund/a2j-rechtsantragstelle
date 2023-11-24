import type { SafeParseError } from "zod";
import { dateSchema } from "~/services/validation/date";

describe("date validation", () => {
  describe("success cases", () => {
    const cases = [{ input: " 01.03.2023  ", expected: "01.03.2023" }];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = dateSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "required" },
      { input: "    ", errorMessage: "required" },
      { input: "10.20.2010", errorMessage: "invalid" },
      { input: "2010-12-01", errorMessage: "invalid" },
      { input: "01.01.2023hihi", errorMessage: "invalid" },
      { input: "01.01.2023456", errorMessage: "invalid" },
      { input: "1.1.2023", errorMessage: "invalid" },
      { input: "01.01.23", errorMessage: "invalid" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = dateSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(
          (actual as SafeParseError<unknown>).error.issues[0].message,
        ).toBe(errorMessage);
      },
    );
  });
});
