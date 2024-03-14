import Input, { type InputProps } from "./Input";
import { IMaskMixin } from "react-imask";

type MaskedInputProps = InputProps & {
  readonly mask: string | RegExp;
  readonly eager?: boolean | ("remove" | "append");
};

const MaskedStyledInput = IMaskMixin<HTMLInputElement, InputProps>(
  ({ inputRef, ...props }) => <Input {...props} ref={inputRef} />,
);

const MaskedInput = (props: MaskedInputProps) => {
  return <MaskedStyledInput {...props} />;
};

export default MaskedInput;
