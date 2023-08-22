/**
 * Strip spaces
 */
const preprocessMoney = (userInput: unknown) => {
  return String(userInput).replace(/\s/g, "");
};

export default preprocessMoney;
