import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import { InputError, Radio, Stack } from "~/components";

type RadioGroupProps = {
  name: string;
  options: { value: string; label: ReactNode }[];
};

const RadioGroup = ({ name, options }: RadioGroupProps) => {
  const { error } = useField(name);

  return (
    <Stack space="m">
      {options.map((o) => (
        <Radio key={o.value} name={name} value={o.value}>
          {o.label}
        </Radio>
      ))}
      {error ? <InputError id={name}>Bitte was auswählen.</InputError> : ""}
    </Stack>
  );
};

export default RadioGroup;
