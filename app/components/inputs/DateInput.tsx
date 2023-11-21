import { type InputProps } from "./Input";
import MaskedInput from "./MaskedInput";

const DateInput = (props: InputProps) => {
  return (
    <MaskedInput mask={Date} placeholder="TT.MM.JJJJ" width="10" {...props} />
  );
};

export default DateInput;
