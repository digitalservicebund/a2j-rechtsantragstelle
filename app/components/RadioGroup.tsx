import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import { InputError, Radio } from "~/components";

type RadioGroupProps = {
  name: string;
  options: { value: string; text?: ReactNode }[];
  label?: string;
  altLabel?: string;
};

const RadioGroup = ({ name, options, label, altLabel }: RadioGroupProps) => {
  const { error } = useField(name);
  return (
    <fieldset
      aria-label={altLabel}
      className="border-0 p-0 m-0 ds-stack stack-16"
    >
      {label && <legend>{label}</legend>}
      {options.map((o) => (
        <Radio key={o.value} name={name} value={o.value} text={o.text} />
      ))}
      {error && (
        <InputError inputName={name}>
          Bitte treffen Sie eine Auswahl.
        </InputError>
      )}
    </fieldset>
  );
};

export default RadioGroup;
