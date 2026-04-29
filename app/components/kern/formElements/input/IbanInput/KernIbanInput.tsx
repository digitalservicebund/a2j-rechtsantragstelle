import { useField } from "@rvf/react-router";
import { useEffect, useState, type FunctionComponent } from "react";
import { IMaskMixin, type IMaskMixinProps } from "react-imask";
import { KernIcon } from "~/components/kern/common/KernIcon";

import TextInput, {
  type InputProps,
} from "~/components/kern/formElements/input/TextInput";
import { useBankData } from "~/components/kern/formElements/input/IbanInput/useBankData";
import { bankNameFromIBAN } from ".";

type MaskedIbanInputProps = InputProps & IMaskMixinProps<HTMLInputElement>;

const MaskedIbanInput: FunctionComponent<MaskedIbanInputProps> = IMaskMixin<
  HTMLInputElement,
  InputProps
>((props) => <TextInput {...props} />);

const KernIbanInput = (props: InputProps) => {
  const field = useField<string | undefined>(props.name);
  const iban = field.value();
  const [bankName, setBankName] = useState<string>();
  const banks = useBankData();

  // Debounce needed to not clobber the screen reader while typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (iban && banks) {
        const matchedBankName = bankNameFromIBAN(iban, banks);
        setBankName(matchedBankName);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [iban, banks]);

  const bankNameBadgeId = "bank-name-badge";

  return (
    <div key={props.name} className="flex flex-col gap-15">
      <MaskedIbanInput
        mask={"**** **** **** **** **** **** **** **** **"}
        type="number"
        prepareChar={(str) => str.toUpperCase()}
        ariaDescribedBy={bankNameBadgeId}
        {...props}
      />
      {/* Badge display of bank name for sighted users */}
      {bankName && (
        <output
          id={bankNameBadgeId}
          className="kern-badge kern-badge-info border-2 border-kern-feedback-info bg-kern-feedback-info-background w-min"
        >
          <KernIcon name="info" className="fill-kern-feedback-info" />
          <span className="kern-label kern-label--small text-nowrap">
            {bankName}
          </span>
        </output>
      )}

      {/* Screenreader-only element used to read out bank name when it changes */}
      <div
        aria-live="polite"
        aria-relevant="all"
        aria-atomic="true"
        className="sr-only"
      >
        <span key={bankName}>{bankName}</span>
      </div>
    </div>
  );
};

export default KernIbanInput;
