import {
  stringRequiredSchema,
  stringRequiredMaxSchema,
} from "~/services/validation/stringRequired";

describe("inputRequired validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: "0", expected: "0" },
      { input: " 0 ", expected: "0" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = stringRequiredSchema.safeParse(input);
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
        const actual = stringRequiredSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );
  });

  describe("stringRequiredMaxSchema configurable max length", () => {
    it("uses provided max", () => {
      const actual = stringRequiredMaxSchema({ max: 3 }).safeParse("abcd");
      expect(actual.success).toBe(false);
      expect(actual.error!.issues[0].message).toBe("max");
    });

    it("falls back to default value when max is undefined", () => {
      const actual = stringRequiredMaxSchema().safeParse("ok");
      expect(actual).toEqual({ data: "ok", success: true });
    });
  });
});
