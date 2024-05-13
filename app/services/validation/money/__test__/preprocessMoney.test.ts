import preprocessMoney from "~/services/validation/money/preprocessMoney";

const cases = [
  { userInput: "99.99", preprocessed: "99.99" },
  { userInput: "Hello You", preprocessed: "HelloYou" },
  { userInput: "-----0", preprocessed: "-----0" },
  { userInput: " 00 00 00 ", preprocessed: "000000" },
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
