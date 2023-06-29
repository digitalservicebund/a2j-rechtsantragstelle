import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import { InputError, Radio } from "~/components";
import { z } from "zod";

export const RadioGroupPropsSchema = z.object({
  name: z.string(),
  options: z.array(
    z.object({ value: z.string(), text: z.custom<ReactNode>().optional() })
  ),
  label: z.custom<ReactNode>().optional(),
  altLabel: z.string().optional(),
});

export type RadioGroupProps = z.infer<typeof RadioGroupPropsSchema>;

const RadioGroup = ({ name, options, label, altLabel }: RadioGroupProps) => {
  const { error } = useField(name);
  const errorId = `${name}-error`;
  return (
    <fieldset
      aria-label={altLabel ? altLabel : undefined}
      className="border-0 p-0 m-0 ds-stack-16"
      aria-invalid={error !== undefined}
      aria-describedby={error && errorId}
      aria-errormessage={error && errorId}
    >
      {label && <legend>{label}</legend>}
      {options.map((o) => (
        <Radio key={o.value} name={name} value={o.value} text={o.text} />
      ))}
      <InputError id={errorId}>Bitte treffen Sie eine Auswahl.</InputError>
    </fieldset>
  );
};

export default RadioGroup;
