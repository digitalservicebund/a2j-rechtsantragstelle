import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import InputError from "./InputError";
import Radio from "./Radio";
import { z } from "zod";
import { ErrorMessagePropsSchema } from ".";

export const RadioGroupPropsSchema = z.object({
  name: z.string(),
  options: z.array(
    z.object({ value: z.string(), text: z.custom<ReactNode>().optional() }),
  ),
  label: z.custom<ReactNode>().optional(),
  altLabel: z.string().optional(),
  errorMessages: z.array(ErrorMessagePropsSchema).optional(),
});

type RadioGroupProps = z.infer<typeof RadioGroupPropsSchema>;

const RadioGroup = ({
  name,
  options,
  label,
  altLabel,
  errorMessages,
}: RadioGroupProps) => {
  const { error } = useField(name);
  const errorId = `${name}-error`;
  return (
    <fieldset
      className="border-0 p-0 m-0"
      aria-invalid={error !== undefined}
      aria-describedby={error && errorId}
      aria-errormessage={error && errorId}
    >
      {altLabel && <legend className="sr-only">{altLabel}</legend>}
      <div className="ds-stack-16">
        {label && <legend>{label}</legend>}
        {options.map((o) => (
          <Radio key={o.value} name={name} value={o.value} text={o.text} />
        ))}
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === error)?.text ?? error}
        </InputError>
      </div>
    </fieldset>
  );
};

export default RadioGroup;
