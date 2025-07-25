import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

describe("money validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: "0", expected: "0" },
      { input: " 0,5 ", expected: "0,5" },
      { input: "40", expected: "40" },
      { input: "2,5 ", expected: "2,5" },
      { input: "", expected: "0" },
      { input: "  ", expected: "0" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = buildKidsCountValidationSchema().safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "foobar", errorMessage: "wrong_format" },
      { input: "3,6", errorMessage: "wrong_format" },
      { input: "50,5", errorMessage: "out_of_range" },
      { input: "-1", errorMessage: "out_of_range" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = buildKidsCountValidationSchema().safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );
  });
});
