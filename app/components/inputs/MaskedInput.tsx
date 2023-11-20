import Input, { type InputProps } from "./Input";
import { IMaskMixin } from "react-imask";

type MaskedInputProps = InputProps & {
  mask: string | RegExp | DateConstructor;
};

const MaskedStyledInput = IMaskMixin<
  IMask.AnyMaskedOptions,
  false,
  string,
  HTMLInputElement,
  InputProps
>(({ inputRef, ...props }) => {
  return <Input {...props} ref={inputRef} />;
});

const MaskedInput = (props: MaskedInputProps) => {
  return <MaskedStyledInput {...props} />;
};

export default MaskedInput;
