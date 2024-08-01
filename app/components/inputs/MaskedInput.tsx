import { IMaskMixin } from "react-imask";
import Input, { type InputProps } from "./Input";

type MaskedInputProps = InputProps & {
  readonly mask: string | RegExp;
  readonly eager?: boolean | ("remove" | "append");
};

const MaskedStyledInput = IMaskMixin<HTMLInputElement, InputProps>(
  ({ inputRef, ...props }) => <Input {...props} innerRef={inputRef} />,
);

const MaskedInput = (props: MaskedInputProps) => {
  return <MaskedStyledInput {...props} />;
};

export default MaskedInput;
