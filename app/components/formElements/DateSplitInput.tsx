import { type InputProps } from "./Input";

const DateSplitInput = (props: InputProps) => {
  return (
    <fieldset className="grid grid-cols-4 gap-2">
      <legend>Geburtsdatum</legend>
      <input
        type="number"
        label="Tag"
        placeholder="TT"
        width="5"
        autoComplete="bday-day"
        {...props}
      />
      <input
        type="number"
        label="Monat"
        placeholder="MM"
        width="5"
        autoComplete="bday-month"
        {...props}
      />
      <input
        type="number"
        label="Jahr"
        placeholder="JJJJ"
        width="5"
        autoComplete="bday-year"
        {...props}
      />
    </fieldset>
  );
};

export default DateSplitInput;
