import { type InputProps } from "./Input";
import MaskedInput from "./MaskedInput";

const DateInput = (props: InputProps) => {
  return (
    <fieldset className="grid grid-cols-4 gap-2">
      <legend>Geburtsdatum</legend>
      <MaskedInput
        type="number"
        label="Tag"
        placeholder="TT"
        width="5"
        autoComplete="bday-day"
        mask={"00"}
        {...props}
      />
      <MaskedInput
        type="number"
        label="Monat"
        placeholder="MM"
        width="5"
        autoComplete="bday-month"
        mask={"00"}
        {...props}
      />
      <MaskedInput
        type="number"
        label="Jahr"
        placeholder="JJJJ"
        width="5"
        autoComplete="bday-year"
        mask={"0000"}
        {...props}
      />
    </fieldset>
  );
};

export default DateInput;
