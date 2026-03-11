import { IMaskMixin, type IMaskMixinProps } from "react-imask";
import Input, { type InputProps } from "./Input";

type MaskedInputProps = InputProps & IMaskMixinProps<HTMLInputElement>;

const MaskedStyledInput = IMaskMixin<HTMLInputElement, InputProps>(
  ({ inputRef, ...props }) => <Input {...props} innerRef={inputRef} />,
);

const MaskedInput = (props: MaskedInputProps) => {
  return <MaskedStyledInput {...props} />;
};

export default MaskedInput;
