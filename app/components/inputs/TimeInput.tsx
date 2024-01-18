import { type InputProps } from "./Input";
import MaskedInput from "./MaskedInput";

const TimeInput = (props: InputProps) => {
  // TODO: Move helperText into CMS common-space.
  return (
    <MaskedInput
      mask={"00:00"}
      type="number"
      width="10"
      helperText="Bitte im Format HH:MM angeben"
      {...props}
    />
  );
};

export default TimeInput;
