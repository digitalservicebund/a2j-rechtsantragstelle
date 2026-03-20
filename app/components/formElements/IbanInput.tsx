import { type InputProps } from "~/components/formElements/Input";
import MaskedInput from "~/components/formElements/MaskedInput";

const IbanInput = (props: Omit<InputProps, "charLimit" | "width">) => {
  return (
    <MaskedInput
      {...props}
      mask={"**** **** **** **** **** **"}
      prepareChar={(str) => str.toUpperCase()}
      charLimit={27}
      width="36" // Could even be 24?
      // placeholder="DE11 1111 1111 1111 1111 11"
    />
  );
};

export default IbanInput;
