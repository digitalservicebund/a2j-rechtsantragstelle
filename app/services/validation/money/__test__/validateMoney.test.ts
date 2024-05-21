import validateMoney from "~/services/validation/money/validateMoney";

const cases = [
  // "okay" (true) means: we are sure, what the user's intent is
  // "not okay" (false) means: we are not sure, or it's likely that the user made a mistake

  // plain euro values are okay
  { input: "-999999999", expected: true },
  { input: "-00000", expected: true }, // we are hearing you
  { input: "-0", expected: true },
  { input: "0", expected: true },
  { input: "00000", expected: true },
  { input: "999999999", expected: true },

  // using comma as decimal separator is okay
  { input: "1,99", expected: true },
  { input: "1000,99", expected: true },

  // we will add the missing 0 at the end for you
  { input: "-1000,9", expected: true },

  // using a dot as decimal deparator is also okay in unambiguous cases
  { input: "1.99", expected: true },
  { input: "-1000.99", expected: true },
  { input: "1000.9", expected: true },

  // digit grouping is fine in "european style"
  { input: "-1.000,8", expected: true },
  { input: "1.000.999,86", expected: true },

  // digit grouping is fine in "us style"
  { input: "1,000.8", expected: true },
  { input: "-1,000,999.86", expected: true },

  { input: "7.999", expected: true }, // 7900
  { input: "7,999", expected: false }, // formally okay: U.S. 7900, but not okay for us

  // ambiguous input is not okay (what is meant? 7,99 or 7.999 or 79.999?)
  { input: "7.9999", expected: false },

  // incomplete input is not okay
  { input: "7,", expected: false },
  { input: "-7.", expected: false },
  { input: "7,,8", expected: false },
  { input: "-99....99.", expected: false },

  // inconsistent digit grouping is not okay (good chance that the user made a mistake)
  { input: "1,000.999.86", expected: false },
  { input: "-1,00,999.86", expected: false },
];

describe("validateMoney", () => {
  test.each(cases)("given $input, returns $expected", ({ input, expected }) => {
    const actual = validateMoney(input);
    expect(actual).toBe(expected);
  });
});
