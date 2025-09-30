import { autocompleteMap } from "~/util/autocompleteMap";
import Input, { type InputProps } from "./Input";

export type DateSplitInputProps = InputProps & {
  legend?: string;
  name: string;
};

const DateSplitInput = ({ legend, name }: DateSplitInputProps) => {
  return (
    <fieldset className="grid grid-cols-3 gap-4">
      <legend>{legend}</legend>
      <Input
        type="number"
        placeholder="TT"
        autoComplete={autocompleteMap[name + ".tag"] ?? "off"}
        name={name}
        label="Tag"
      />
      <Input
        type="number"
        placeholder="MM"
        autoComplete={autocompleteMap[name + ".monat"] ?? "off"}
        name={name}
        label="Monat"
      />
      <Input
        type="number"
        placeholder="JJJJ"
        autoComplete={autocompleteMap[name + ".jahr"] ?? "off"}
        name={name}
        label="Jahr"
      />
    </fieldset>
  );
};

export default DateSplitInput;
