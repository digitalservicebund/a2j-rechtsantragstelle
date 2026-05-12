import { type FunctionComponent, useEffect, useRef } from "react";
import { IMaskMixin, type IMaskMixinProps } from "react-imask";
import TextInput, { type InputProps } from "../text/TextInput";
import { useBankData } from "./useBankData";
import { bankNameFromIBAN } from "./bankNameFromIBAN";
import { useField, useFormContext } from "@rvf/react-router";

type MaskedIbanInputProps = InputProps & IMaskMixinProps<HTMLInputElement>;

const MaskedIbanInput: FunctionComponent<MaskedIbanInputProps> = IMaskMixin<
  HTMLInputElement,
  InputProps
>((props) => {
  // Needs to be uncontrolled, so that the value gets masked on page load
  return <TextInput {...props} controlled={false} />;
});

// const bankNameBadgeId = "bank-name-badge";

const IbanInput = (props: InputProps) => {
  const ibanField = useField<string | undefined>(props.name);
  const form = useFormContext<any>();
  const bankNameField = form?.field("bankName");
  const iban = ibanField.value();
  const originalIbanValue = useRef(iban).current;
  const banks = useBankData();

  useEffect(() => {
    // needed to ensure value isn't automatically set upon initial render
    if (originalIbanValue !== iban) {
      if (iban && iban.length > 0 && banks) {
        // Debounce needed to not clobber the screen reader while typing
        const timeout = setTimeout(() => {
          const matchedBankName = bankNameFromIBAN(iban, banks);
          if (matchedBankName) {
            bankNameField.setValue(matchedBankName);
            bankNameField.validate();
          } else {
            bankNameField.setValue("");
          }
        }, 1000);

        return () => clearTimeout(timeout);
      }
      bankNameField?.setValue("");
    }
  }, [iban, banks, bankNameField, originalIbanValue]);

  return (
    <div key={props.name} className="flex flex-col gap-15">
      <MaskedIbanInput
        mask={"**** **** **** **** **** **** **** **** **"}
        type="number"
        prepareChar={(str) => str.toUpperCase()}
        // ariaDescribedBy={bankNameBadgeId}
        {...props}
      />
      {/* <BankNameBadge bankNameBadgeId={bankNameBadgeId} bankName={bankName} /> */}
    </div>
  );
};

export default IbanInput;
