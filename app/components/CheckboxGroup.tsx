import { type ReactNode, useState } from "react";
import { useField } from "remix-validated-form";
import InputError from "./InputError";
import Checkbox from "./Checkbox";
import { z } from "zod";
import { ErrorMessagePropsSchema } from ".";

export const CheckboxGroupPropsSchema = z.object({
  name: z.string(),
  options: z.array(
    z.object({ value: z.string(), text: z.custom<ReactNode>().optional() }),
  ),
  label: z.custom<ReactNode>().optional(),
  altLabel: z.string().optional(),
  errorMessages: z.array(ErrorMessagePropsSchema).optional(),
});

type CheckboxGroupProps = z.infer<typeof CheckboxGroupPropsSchema>;

const CheckboxGroup = ({
  name,
  options,
  label,
  altLabel,
  errorMessages,
}: CheckboxGroupProps) => {
  const { error, defaultValue } = useField(name);
  const errorId = `${name}-error`;
  // Without JS, we need a same-named hidden field for validation without user input
  // It gets removed on clicking any Checkbox option to still allow for front-end validation
  const [renderHiddenField, setRenderHiddenField] = useState(
    defaultValue === undefined,
  );

  return (
    <fieldset
      className="border-0 p-0 m-0"
      aria-invalid={error !== undefined}
      aria-describedby={error && errorId}
      aria-errormessage={error && errorId}
    >
      {altLabel && <legend className="sr-only">{altLabel}</legend>}
      {renderHiddenField && <input type="hidden" name={name} />}
      <div className="ds-stack-16">
        {label && <legend>{label}</legend>}
        {options.map((o) => (
          <Checkbox
            key={o.value}
            name={name}
            value={o.value}
            text={o.text}
            onClick={() => setRenderHiddenField(false)}
          />
        ))}
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === error)?.text ?? error}
        </InputError>
      </div>
    </fieldset>
  );
};

export default CheckboxGroup;
