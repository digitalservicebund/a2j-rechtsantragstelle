import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import { InputError, Radio } from "~/components";

type RadioGroupProps = {
  name: string;
  options: { value: string; text?: ReactNode }[];
};

const RadioGroup = ({ name, options }: RadioGroupProps) => {
  const { error } = useField(name);
  return (
    <div className="ds-stack stack-16">
      {options.map((o) => (
        <Radio key={o.value} name={name} value={o.value} text={o.text} />
      ))}
      {error && <InputError inputName={name}>Bitte was auswählen.</InputError>}
    </div>
  );
};

export default RadioGroup;
