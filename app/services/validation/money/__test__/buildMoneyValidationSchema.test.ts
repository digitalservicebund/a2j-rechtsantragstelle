import {
  buildMoneyValidationSchema,
  buildOptionalMoneyValidationSchema,
} from "~/services/validation/money/buildMoneyValidationSchema";

describe("buildMoneyValidationSchema", () => {
  describe("success cases", () => {
    const cases = [
      { input: "1", expected: "1,00" },
      { input: " 1 ", expected: "1,00" },
      { input: " 1 000", expected: "1.000,00" },
      { input: " 1 00 0", expected: "1.000,00" },
      { input: "1,000.9", expected: "1.000,90" },
      { input: "00000", expected: "0,00" },
      { input: "99999999", expected: "99.999.999,00" },
      { input: "-0", expected: "0,00" },
      { input: "-123", expected: "-123,00" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = buildMoneyValidationSchema({
          min: Number.MIN_SAFE_INTEGER,
        }).safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "required" },
      { input: "  ", errorMessage: "required" },
      { input: "foobar", errorMessage: "wrong_format" },
      { input: "3 thousand", errorMessage: "wrong_format" },
      { input: "123,123,", errorMessage: "wrong_format" },
      { input: "2000000", errorMessage: "too_much" },
      { input: "-2000000", errorMessage: "too_little" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = buildMoneyValidationSchema({
          min: -1000000,
          max: 1000000,
        }).safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );

    describe("default option values", () => {
      it("should fail in case the max value is equal or higher than the max default value", () => {
        const inputValue = "100000001";

        const actual = buildMoneyValidationSchema().safeParse(inputValue);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe("too_much");
      });

      it("should fail in case the max value is equal or higher than the max default value and the optional default value is empty object", () => {
        const inputValue = "100000001";

        const actual = buildMoneyValidationSchema({}).safeParse(inputValue);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe("too_much");
      });

      it("should fail in case the min value is lower than the min default value", () => {
        const inputValue = "-1";

        const actual = buildMoneyValidationSchema().safeParse(inputValue);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe("too_little");
      });

      it("should fail in case the min value is lower than the min default value is empty object", () => {
        const inputValue = "-1";

        const actual = buildMoneyValidationSchema({}).safeParse(inputValue);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe("too_little");
      });
    });
  });
});

describe("buildOptionalMoneyValidationSchema", () => {
  describe("success cases", () => {
    const cases = [
      { input: "1", expected: "1,00" },
      { input: " 1 ", expected: "1,00" },
      { input: " 1 000", expected: "1.000,00" },
      { input: " 1 00 0", expected: "1.000,00" },
      { input: "1,000.9", expected: "1.000,90" },
      { input: "00000", expected: "0,00" },
      { input: "99999999", expected: "99.999.999,00" },
      { input: "-0", expected: "0,00" },
      { input: "-123", expected: "-123,00" },
      { input: "", expected: "" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = buildOptionalMoneyValidationSchema({
          min: Number.MIN_SAFE_INTEGER,
        }).safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "foobar", errorMessage: "wrong_format" },
      { input: "3 thousand", errorMessage: "wrong_format" },
      { input: "123,123,", errorMessage: "wrong_format" },
      { input: "2000000", errorMessage: "too_much" },
      { input: "-2000000", errorMessage: "too_little" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = buildOptionalMoneyValidationSchema({
          min: -1000000,
          max: 1000000,
        }).safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );

    describe("default option values", () => {
      it("should fail in case the max value is equal or higher than the max default value", () => {
        const inputValue = "100000001";

        const actual =
          buildOptionalMoneyValidationSchema().safeParse(inputValue);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe("too_much");
      });

      it("should fail in case the max value is equal or higher than the max default value and the optional default value is empty object", () => {
        const inputValue = "100000001";

        const actual = buildOptionalMoneyValidationSchema({}).safeParse(
          inputValue,
        );
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe("too_much");
      });

      it("should fail in case the min value is lower than the min default value", () => {
        const inputValue = "-1";

        const actual =
          buildOptionalMoneyValidationSchema().safeParse(inputValue);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe("too_little");
      });

      it("should fail in case the min value is lower than the min default value is empty object", () => {
        const inputValue = "-1";

        const actual = buildOptionalMoneyValidationSchema({}).safeParse(
          inputValue,
        );
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe("too_little");
      });
    });
  });
});
