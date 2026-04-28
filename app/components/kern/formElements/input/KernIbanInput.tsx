import { useField } from "@rvf/react-router";
import { useEffect, useState, type FunctionComponent } from "react";
import { IMaskMixin, type IMaskMixinProps } from "react-imask";
import { KernIcon } from "~/components/kern/common/KernIcon";

import TextInput, {
  type InputProps,
} from "~/components/kern/formElements/input/TextInput";
import { bankNameFromIBAN } from "~/services/bankCodes";

type MaskedIbanInputProps = InputProps & IMaskMixinProps<HTMLInputElement>;

const MaskedIbanInput: FunctionComponent<MaskedIbanInputProps> = IMaskMixin<
  HTMLInputElement,
  InputProps
>((props) => <TextInput {...props} />);

const KernIbanInput = (props: InputProps) => {
  const field = useField<string | undefined>(props.name);
  const iban = field.value();
  const [bankName, setBankName] = useState<string | null>(null);

  // Debounce needed to not clobber the screen reader while typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      const matchedBankName = bankNameFromIBAN(iban);
      setBankName(matchedBankName || null);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [iban]);

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
