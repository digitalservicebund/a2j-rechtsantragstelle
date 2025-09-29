import { autocompleteMap } from "~/util/autocompleteMap";
import Input, { type InputProps } from "./Input";
import InputLabel from "./InputLabel";

export type DateSplitInputProps = InputProps & {
  labels?: [string, string, string];
  legend?: string;
  name: string;
};

const DateSplitInput = ({ labels, legend, name }: DateSplitInputProps) => {
  return (
    <fieldset className="grid grid-cols-3 gap-2">
      <legend>{legend}</legend>
      {labels && <InputLabel id={`${name}-day`}>{labels[0]}</InputLabel>}
      {labels && <InputLabel id={`${name}-day`}>{labels[1]}</InputLabel>}
      {labels && <InputLabel id={`${name}-day`}>{labels[2]}</InputLabel>}

      <Input
        type="number"
        placeholder="TT"
        autoComplete={autocompleteMap[name] ?? "off"}
        name={name}
      />
      <Input
        type="number"
        placeholder="MM"
        autoComplete={autocompleteMap[name] ?? "off"}
        name={name}
      />
      <Input
        type="number"
        placeholder="JJJJ"
        autoComplete={autocompleteMap[name] ?? "off"}
        name={name}
      />
    </fieldset>
  );
};

export default DateSplitInput;
