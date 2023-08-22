const MONEY_GERMAN = /^-?\d{1,3}(\.\d{3})+(,\d{1,2})?$/;
const MONEY_US = /^-?\d{1,3}(,\d{3})+(\.\d{1,2})$/;
const MONEY_SIMPLE = /^-?\d+([,.]\d{1,2})?$/;

const validateMoney = (input: string) => {
  return (
    MONEY_GERMAN.test(input) || MONEY_US.test(input) || MONEY_SIMPLE.test(input)
  );
};

export default validateMoney;
