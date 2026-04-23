import { type FunctionComponent } from "react";
import { IMaskMixin, type IMaskMixinProps } from "react-imask";

import TextInput, {
  type InputProps,
} from "~/components/kern/formElements/input/TextInput";

type MaskedIbanInputProps = InputProps & IMaskMixinProps<HTMLInputElement>;

const MaskedIbanInput: FunctionComponent<MaskedIbanInputProps> = IMaskMixin<
  HTMLInputElement,
  InputProps
>((props) => <TextInput {...props} />);

const KernIbanInput = (props: InputProps) => {
  return (
    <MaskedIbanInput
      mask={"**** **** **** **** **** **** **** **** **"}
      type="number"
      prepareChar={(str) => str.toUpperCase()}
      {...props}
    />
  );
};

export default KernIbanInput;
