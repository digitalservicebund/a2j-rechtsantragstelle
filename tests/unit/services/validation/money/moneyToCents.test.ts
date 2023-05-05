import moneyToCents from "~/services/validation/money/moneyToCents";

const cases = [
  { money: "-0", cents: 0 },
  { money: "0", cents: 0 },
  { money: "0000", cents: 0 },
  { money: "99.99", cents: 9999 },
  { money: "-99.99", cents: -9999 },
  { money: "11.123,7", cents: 1112370 },
  { money: "11,123.7", cents: 1112370 },
];

describe("moneyToCents", () => {
  test.each(cases)("given $money, returns $cents", ({ money, cents }) => {
    const actual = moneyToCents(money);
    expect(actual).toBe(cents);
  });
});
