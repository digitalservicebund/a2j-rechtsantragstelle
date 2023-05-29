/**
 * Strip superfluous characters from user's input
 * @example
 * // returns -12.3456,789
 * preprocessMoney("EUR: -12 . 3 456,7 8-9 € foobar ");
 */
const preprocessMoney = (userInput: unknown) => {
  const reducedToValidCharacters = String(userInput).replace(/[^0-9.,-]/g, "");
  return (
    reducedToValidCharacters[0] +
    reducedToValidCharacters.slice(1).replace(/-/g, "")
  );
};

export default preprocessMoney;
