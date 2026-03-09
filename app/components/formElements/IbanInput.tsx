import { type InputProps } from "~/components/formElements/Input";
import MaskedInput from "~/components/formElements/MaskedInput";

const IbanInput = (props: InputProps) => {
  return (
    <MaskedInput
      mask={"**** **** **** **** **** **** **** **** **"}
      type="number"
      eager={"append"}
      {...props}
    />
  );
};

export default IbanInput;
