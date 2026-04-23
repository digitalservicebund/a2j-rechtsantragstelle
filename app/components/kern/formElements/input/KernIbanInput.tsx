import { useField } from "@rvf/react-router";
import { type FunctionComponent } from "react";
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
  const iban = useField<string | undefined>(props.name).value();
  const bankName = bankNameFromIBAN(iban);
  return (
    <div key={props.name} className="flex flex-col gap-15">
      <MaskedIbanInput
        mask={"**** **** **** **** **** **** **** **** **"}
        type="number"
        prepareChar={(str) => str.toUpperCase()}
        {...props}
      />
      {bankName && (
        <output
          id="bank name"
          aria-atomic={true}
          className="kern-badge kern-badge-info border-2 border-kern-feedback-info bg-kern-feedback-info-background w-min"
        >
          <KernIcon name="info" className="fill-kern-feedback-info" />
          <span className="kern-label kern-label--small text-nowrap">
            {bankName}
          </span>
        </output>
      )}
    </div>
  );
};

export default KernIbanInput;
