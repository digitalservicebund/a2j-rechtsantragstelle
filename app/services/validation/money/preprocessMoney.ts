/**
 * Strip spaces
 */
const preprocessMoney = (userInput: unknown) => {
  return String(userInput).replaceAll(/\s/g, "");
};

export default preprocessMoney;
