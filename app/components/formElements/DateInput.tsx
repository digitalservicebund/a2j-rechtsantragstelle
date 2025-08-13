import { type InputProps } from "./Input";
import MaskedInput from "./MaskedInput";

const DateInput = (props: InputProps) => {
  return (
    <MaskedInput
      mask={"0`0`.0`0`.0`0`0`0"}
      type="number"
      placeholder="TT.MM.JJJJ"
      width="10"
      eager={"append"}
      {...props}
    />
  );
};

export default DateInput;
