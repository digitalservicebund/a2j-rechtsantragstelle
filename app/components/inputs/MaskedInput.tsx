import Input, { type InputProps } from "./Input";
import { IMaskMixin } from "react-imask";

type MaskedInputProps = InputProps & {
  readonly mask: string | RegExp;
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
