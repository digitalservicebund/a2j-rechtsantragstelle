const MONEY_GERMAN = /^-?\d{1,3}(\.\d{3})+(,\d{1,2})?$/;
const MONEY_US = /^-?\d{1,3}(,\d{3})+(\.\d{1,2})$/;
const MONEY_SIMPLE = /^-?\d+([,.]\d{1,2})?$/;

const validateMoney = (preprocessedMoney: string) => {
  return (
    MONEY_GERMAN.test(preprocessedMoney) ||
    MONEY_US.test(preprocessedMoney) ||
    MONEY_SIMPLE.test(preprocessedMoney)
  );
};

export default validateMoney;
