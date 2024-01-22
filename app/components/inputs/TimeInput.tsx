import { type InputProps } from "./Input";
import MaskedInput from "./MaskedInput";

const TimeInput = (props: InputProps) => {
  return <MaskedInput mask={"`0`0:`0`0"} type="number" width="10" {...props} />;
};

export default TimeInput;
