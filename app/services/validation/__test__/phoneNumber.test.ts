import { phoneNumberSchema } from "~/services/validation/phoneNumber";

describe("phoneNumber validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: "015100000000", expected: "015100000000" },
      { input: "+49123456", expected: "+49123456" },
      { input: " 030111111  ", expected: "030111111" },
      { input: "030 111 222", expected: "030 111 222" },
      { input: "123", expected: "123" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = phoneNumberSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "abcde", errorMessage: "invalid" },
      { input: "12", errorMessage: "invalid" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = phoneNumberSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );
  });
});
