import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

const cases = [
  { input: "0", expected: "0" },
  { input: " 0,5 ", expected: "0,5" },
  { input: "40", expected: "40" },
  { input: "2,5 ", expected: "2,5" },
  { input: "", expected: "0" },
  { input: "  ", expected: "0" },
];

const failingCases = [
  { input: "foobar", errorMessage: "wrong_format" },
  { input: "3,6", errorMessage: "wrong_format" },
  { input: "50,5", errorMessage: "out_of_range" },
  { input: "-1", errorMessage: "out_of_range" },
];

describe("money validation", () => {
  describe("success cases", () => {
    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = buildKidsCountValidationSchema().safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      }
    );
  });

  describe("failing cases", () => {
    test.each(failingCases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = buildKidsCountValidationSchema().safeParse(input);
        expect(actual.success).toBe(false);
        //@ts-ignore
        expect(actual.error.issues[0].message).toBe(errorMessage);
      }
    );
  });
});
