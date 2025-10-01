import { autocompleteMap } from "~/util/autocompleteMap";
import Input, { type InputProps } from "./Input";
import { useField } from "@rvf/react-router";

export type SplitDateInputProps = InputProps & {
  legend?: string;
  name: string;
  label?: string;
};

export const SplitDateInput = ({
  legend,
  label,
  name,
}: SplitDateInputProps) => {
  const field = useField(name);

  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());
  console.log(name);

  return (
    <fieldset
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-errormessage={hasError ? errorId : undefined}
    >
      {legend && <legend>{legend}</legend>}
      <div className="flex flex-row gap-16">
        <Input
          type="number"
          placeholder="TT"
          autoComplete={autocompleteMap[name + ".tag"] ?? "off"}
          name={name + ".tag"}
          label="Tag"
          width="3"
        />
        <Input
          type="number"
          placeholder="MM"
          autoComplete={autocompleteMap[name + ".monat"] ?? "off"}
          name={name + ".monat"}
          width="3"
          label="Monat"
        />
        <Input
          type="number"
          placeholder="JJJJ"
          autoComplete={autocompleteMap[name + ".jahr"] ?? "off"}
          name={name + ".jahr"}
          width="5"
          label="Jahr"
        />
      </div>
    </fieldset>
  );
};

export default SplitDateInput;
