import { type FunctionComponent, useEffect, useRef, useState } from "react";
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

const IbanInput = (props: InputProps) => {
  const ibanField = useField<string | undefined>(props.name);
  const form = useFormContext<any>();
  const bankNameField = form?.field("bankName");
  const iban = ibanField.value();
  const originalIbanValue = useRef(iban).current;
  const banks = useBankData();
  const [srBankName, setSrBankName] = useState<string>();

  useEffect(() => {
    // needed to ensure value isn't automatically set upon initial render
    if (originalIbanValue !== iban) {
      if (iban && iban.length > 0 && banks) {
        // Debounce needed to not clobber the screen reader while typing
        const timeout = setTimeout(() => {
          const matchedBankName = bankNameFromIBAN(iban, banks);
          if (matchedBankName) {
            setSrBankName(matchedBankName);
            bankNameField.setValue(matchedBankName);
            bankNameField.validate();
          } else {
            setSrBankName("");
            bankNameField.setValue("");
          }
        }, 1000);

        return () => clearTimeout(timeout);
      }
      setSrBankName("");
      bankNameField?.setValue("");
    }
  }, [iban, banks, bankNameField, originalIbanValue]);

  return (
    <div key={props.name} className="flex flex-col gap-15">
      <MaskedIbanInput
        mask={"**** **** **** **** **** **** **** **** **"}
        type="number"
        prepareChar={(str) => str.toUpperCase()}
        ariaDescribedBy="bankName"
        {...props}
      />

      {/* Screenreader-only element used to read out bank name when it changes */}
      <div
        aria-live="polite"
        aria-relevant="all"
        aria-atomic="true"
        className="sr-only"
      >
        <span key={srBankName}>
          {srBankName && `Bank identifiziert: ${srBankName}`}
        </span>
      </div>
    </div>
  );
};

export default IbanInput;
