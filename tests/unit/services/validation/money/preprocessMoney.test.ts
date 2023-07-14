import preprocessMoney from "~/services/validation/money/preprocessMoney";

const cases = [
  { userInput: "I have nothing, nada, 0 😀", preprocessed: ",,0" },
  { userInput: "0--foo bar--12", preprocessed: "012" },
  { userInput: "99.99", preprocessed: "99.99" },
  { userInput: "-----0", preprocessed: "-0" },
  { userInput: "00 00 00", preprocessed: "000000" },
  { userInput: "-123, 7899  ", preprocessed: "-123,7899" },
  { userInput: "EUR: -123", preprocessed: "-123" },
  { userInput: "1_000_000", preprocessed: "1000000" },
];

describe("preprocessMoney", () => {
  test.each(cases)(
    "given $userInput, returns $preprocessed",
    ({ userInput, preprocessed }) => {
      const actual = preprocessMoney(userInput);
      expect(actual).toBe(preprocessed);
    },
  );
});
