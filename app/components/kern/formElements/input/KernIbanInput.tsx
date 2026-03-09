import { type InputProps } from "~/components/formElements/Input";
import MaskedInput from "~/components/formElements/MaskedInput";

const KernIbanInput = (props: InputProps) => {
  return (
    <MaskedInput
      mask={"**** **** **** **** **** **** **** **** **"}
      type="number"
      eager={"append"}
      prepareChar={(str) => str.toUpperCase()}
      {...props}
    />
  );
};

export default KernIbanInput;
