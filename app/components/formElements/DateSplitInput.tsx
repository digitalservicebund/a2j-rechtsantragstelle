import Input, { type InputProps } from "./Input";
import InputLabel from "./InputLabel";

export type DateSplitInputProps = InputProps & {
  labels?: [string, string, string];
  legend?: string;
  name: string;
};

const DateSplitInput = ({
  labels = ["Tag", "Monat", "Jahr"],
  legend = "Geburtsdatum",
  name,
}: DateSplitInputProps) => {
  return (
    <fieldset className="grid grid-cols-3 gap-2">
      <legend>{legend}</legend>
      <InputLabel id={`${name}-day`}>{labels[0]}</InputLabel>
      <InputLabel id={`${name}-day`}>{labels[1]}</InputLabel>
      <InputLabel id={`${name}-day`}>{labels[2]}</InputLabel>
      <Input
        type="number"
        placeholder="TT"
        width="5"
        autoComplete="bday-day"
        name={name}
      />
      <Input
        type="number"
        placeholder="MM"
        width="5"
        autoComplete="bday-month"
        name={name}
      />
      <Input
        type="number"
        placeholder="JJJJ"
        width="5"
        autoComplete="bday-year"
        name={name}
      />
    </fieldset>
  );
};

export default DateSplitInput;
