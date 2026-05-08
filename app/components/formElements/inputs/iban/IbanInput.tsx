import { useField } from "@rvf/react-router";
import { useEffect, useState, type FunctionComponent } from "react";
import { IMaskMixin, type IMaskMixinProps } from "react-imask";
import TextInput, { type InputProps } from "../text/TextInput";
import { useBankData } from "./useBankData";
import { bankNameFromIBAN } from "./bankNameFromIBAN";

type MaskedIbanInputProps = InputProps & IMaskMixinProps<HTMLInputElement>;

const MaskedIbanInput: FunctionComponent<MaskedIbanInputProps> = IMaskMixin<
  HTMLInputElement,
  InputProps
>((props) => <TextInput {...props} />);

const bankNameBadgeId = "bank-name-badge";

const IbanInput = (props: InputProps) => {
  const ibanField = useField<string | undefined>(props.name);
  const bankNameField = useField<string | undefined>("bankName");
  const iban = ibanField.value();
  const [bankName, setBankName] = useState<string>();
  const banks = useBankData();

  // Debounce needed to not clobber the screen reader while typing
  useEffect(() => {
    if (iban && banks) {
      const timeout = setTimeout(() => {
        const matchedBankName = bankNameFromIBAN(iban, banks);
        setBankName(matchedBankName);
      }, 1000);

      return () => clearTimeout(timeout);
    }
    setBankName(undefined);
  }, [iban, banks, bankNameField]);

  return (
    <div key={props.name} className="flex flex-col gap-15">
      <MaskedIbanInput
        mask={"**** **** **** **** **** **** **** **** **"}
        type="number"
        prepareChar={(str) => str.toUpperCase()}
        ariaDescribedBy={bankNameBadgeId}
        {...props}
      />
      {/* <BankNameBadge bankNameBadgeId={bankNameBadgeId} bankName={bankName} /> */}
      <input
        type="text"
        {...bankNameField.getInputProps()}
        value={bankName ?? ""}
        defaultValue={undefined}
      />
    </div>
  );
};

export default IbanInput;
