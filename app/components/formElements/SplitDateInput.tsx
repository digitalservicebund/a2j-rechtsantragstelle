import { autocompleteMap } from "~/util/autocompleteMap";
import Input, { type InputProps } from "./Input";
import { useField } from "@rvf/react-router";

export type SplitDateInputProps = InputProps & {
  name: string;
  label?: string;
  legend?: string;
  hintText?: string;
};

export const SplitDateInput = ({
  name,
  label,
  legend,
  hintText,
}: SplitDateInputProps) => {
  const field = useField(name);

  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());

  return (
    <fieldset
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-errormessage={hasError ? errorId : undefined}
    >
      {legend && <legend>{legend}</legend>}
      {hintText && <p>{hintText}</p>}

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
