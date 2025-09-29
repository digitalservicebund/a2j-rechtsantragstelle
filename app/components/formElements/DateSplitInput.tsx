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
        name="geburtsdatum.geburtsdatumTag"
      />
      <input
        type="number"
        label="Monat"
        placeholder="MM"
        width="5"
        autoComplete="bday-month"
        {...props}
        name="geburtsdatum.geburtsdatumMonat"
      />
      <input
        type="number"
        label="Jahr"
        placeholder="JJJJ"
        width="5"
        autoComplete="bday-year"
        {...props}
        name="geburtsdatum.geburtsdatumJahr"
      />
    </fieldset>
  );
};

export default DateSplitInput;
