/**
 * Strip superfluous characters from user's input
 * @example
 * // returns -12.3456,789
 * preprocessMoney("EUR: -12 . 3 456,7 8-9 € foobar ");
 */
const preprocessMoney = (userInput: unknown) => {
  const reducedToValidCharacters = String(userInput).replace(/[^0-9.,-]/g, "");
  const onlyLeadingMinusKept = reducedToValidCharacters.replace(/(?<=.)-/g, "");
  return onlyLeadingMinusKept;
};

export default preprocessMoney;
