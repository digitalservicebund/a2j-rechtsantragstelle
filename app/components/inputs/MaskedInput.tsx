import { type NullToUndefined, omitNull } from "~/util/omitNull";
import Input, { type InputProps } from "./Input";
import { IMaskMixin } from "react-imask";

type MaskedInputProps = InputProps & {
  readonly mask: string | RegExp;
  readonly eager?: boolean | ("remove" | "append");
};

const MaskedStyledInput = IMaskMixin<
  HTMLInputElement,
  NullToUndefined<InputProps>
>(({ inputRef, label, ...props }) => (
  <Input label={label ?? undefined} {...props} ref={inputRef} />
));

const MaskedInput = (props: MaskedInputProps) => {
  return <MaskedStyledInput {...omitNull(props)} />;
};

export default MaskedInput;
