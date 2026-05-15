import {
  type BankData,
  bankNameFromIBAN,
} from "~/components/formElements/inputs/iban/bankNameFromIBAN";
import { fetchBanks } from "~/components/formElements/inputs/iban/fetchBanks";
import { type FieldValueChangeHandler } from "~/domains/pageSchemas";

let banks: BankData | undefined = undefined;

const getBanks = async () => {
  banks ??= await fetchBanks();

  return banks;
};

export const setBankNameFromIban: FieldValueChangeHandler = async ({
  originalValue,
  value,
  controlledField,
  setControlledFieldSrValue,
}) => {
  if (originalValue !== value) {
    const banks = await getBanks();
    if (value && typeof value === "string" && value.length > 0 && banks) {
      // Debounce needed to not clobber the screen reader while typing
      const timeout = setTimeout(() => {
        const matchedBankName = bankNameFromIBAN(value, banks);
        if (matchedBankName) {
          setControlledFieldSrValue(matchedBankName);
          controlledField.setValue(matchedBankName);
          controlledField.validate();
        } else {
          setControlledFieldSrValue("");
          controlledField.setValue("");
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }
    setControlledFieldSrValue("");
    controlledField?.setValue("");
  }
};
