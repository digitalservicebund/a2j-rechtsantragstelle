import formatCents from "~/services/validation/money/formatCents";

const cases = [
  { cents: Number.MIN_SAFE_INTEGER + 1, formatted: "-90.071.992.547.409,90" },
  { cents: -123456789, formatted: "-1.234.567,89" },
  { cents: -99999, formatted: "-999,99" },
  { cents: -12, formatted: "-0,12" },
  { cents: -5, formatted: "-0,05" },
  { cents: -0, formatted: "-0,00" },
  { cents: 0, formatted: "0,00" },
  { cents: 5, formatted: "0,05" },
  { cents: 12, formatted: "0,12" },
  { cents: 99999, formatted: "999,99" },
  { cents: 123456789, formatted: "1.234.567,89" },
  { cents: Number.MAX_SAFE_INTEGER - 1, formatted: "90.071.992.547.409,90" },
];

const failingCases = [0.99, Number.MAX_SAFE_INTEGER + 99];

describe("formatCents", () => {
  describe("given an integer", () => {
    test.each(cases)(
      "given $cents, returns $formatted",
      ({ cents, formatted }) => {
        const actual = formatCents(cents);
        expect(actual).toBe(formatted);
      }
    );
  });

  describe("given other input", () => {
    test.each(failingCases)("given $cents, throws", (invalidInput) => {
      expect(() => formatCents(invalidInput)).toThrow(
        "please pass only (safe) integers"
      );
    });
  });
});
