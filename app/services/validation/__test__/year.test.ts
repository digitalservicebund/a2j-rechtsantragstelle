import { createYearSchema } from "~/services/validation/year";

describe("year validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: "1997", expected: 1997 },
      { input: 2005, expected: 2005 },
      { input: "", expected: "", yearSchemaArgs: { optional: true } },
      {
        input: undefined,
        expected: undefined,
        yearSchemaArgs: { optional: true },
      },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected, yearSchemaArgs }) => {
        const actual = createYearSchema(yearSchemaArgs).safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "required" },
      { input: "    ", errorMessage: "invalidYear" },
      { input: 1849, errorMessage: "invalidYear" },
      { input: "2081", errorMessage: "invalidYear" },
      { input: undefined, errorMessage: "invalidYear" },
      {
        input: "1980",
        errorMessage: "invalidYear",
        yearSchemaArgs: { earliest: () => 2000 },
      },
      {
        input: "2010",
        errorMessage: "invalidYear",
        yearSchemaArgs: { latest: () => 2005 },
      },
    ];
    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage, yearSchemaArgs }) => {
        const actual = createYearSchema(yearSchemaArgs).safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );
  });
});
