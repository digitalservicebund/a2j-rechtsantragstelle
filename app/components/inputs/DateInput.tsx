import { type InputProps } from "./Input";
import MaskedInput from "./MaskedInput";

const DateInput = (props: InputProps) => {
  // TODO: Move helperText into CMS common-space.
  return (
    <MaskedInput
      mask={"0`0`.0`0`.0`0`0`0"}
      type="number"
      placeholder="TT.MM.JJJJ"
      width="10"
      // helperText="Bitte im Format TT.MM.JJJJ angeben"
      {...props}
    />
  );
};

export default DateInput;
