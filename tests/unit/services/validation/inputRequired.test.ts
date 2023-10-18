import { inputRequiredSchema } from "~/services/validation/inputRequired";
import type { SafeParseError } from "zod";

describe("inputRequired validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: "0", expected: "0" },
      { input: " 0 ", expected: "0" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = inputRequiredSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "required" },
      { input: "   ", errorMessage: "required" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = inputRequiredSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(
          (actual as SafeParseError<unknown>).error.issues[0].message,
        ).toBe(errorMessage);
      },
    );
  });
});
