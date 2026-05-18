import { useField } from "@rvf/react-router";
import { useEffect, useState, type FunctionComponent } from "react";
import { IMaskMixin, type IMaskMixinProps } from "react-imask";
import { Icon } from "~/components/common/Icon";
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
  const field = useField<string | undefined>(props.name);
  const iban = field.value();
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
  }, [iban, banks]);

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
          className="kern-badge kern-badge-info border-2 border-kern-feedback-info bg-kern-feedback-info-background min-w-fit w-min"
        >
          <Icon name="info" className="fill-kern-feedback-info" />
          <span className="kern-label kern-label--small">{bankName}</span>
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

export default IbanInput;
