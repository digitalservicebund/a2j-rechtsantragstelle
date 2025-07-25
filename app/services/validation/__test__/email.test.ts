import { emailSchema } from "~/services/validation/email";

describe("email validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: " hey@example.com  ", expected: "hey@example.com" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = emailSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "abc", errorMessage: "invalid" },
      { input: "a@b", errorMessage: "invalid" },
      { input: "a@b.c@", errorMessage: "invalid" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = emailSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );
  });
});
