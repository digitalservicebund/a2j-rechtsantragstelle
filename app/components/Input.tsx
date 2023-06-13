import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import { InputError, InputLabel } from "~/components";
import { z } from "zod";

export const InputPropsSchema = z.object({
  name: z.string(),
  label: z.custom<ReactNode>().optional(),
  type: z.string().optional(),
  step: z.string().optional(),
  placeholder: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  defaultValue: z.string().optional(),
  errors: z
    .array(
      z.object({
        attributes: z.object({
          name: z.string(),
          errorCodes: z.array(
            z.object({
              code: z.string(),
              text: z.string(),
            })
          ),
        }),
      })
    )
    .optional(),
});

export type InputProps = z.infer<typeof InputPropsSchema>;

const Input = ({
  name,
  label,
  type = "text",
  step,
  placeholder,
  prefix,
  suffix,
  defaultValue,
  errors,
}: InputProps) => {
  const { error, getInputProps } = useField(name);

  const flattenedErrorCodes = errors
    ?.map((e) => e.attributes.errorCodes)
    .flat();

  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <div className="ds-input-group">
        {prefix && <div className="ds-input-prefix">{prefix}</div>}
        <input
          {...getInputProps({
            type: type === "number" ? "text" : type,
            step,
            id: name,
            inputMode: type === "number" ? "decimal" : undefined,
            placeholder,
          })}
          className={classNames("ds-input", { "has-error": error })}
          aria-describedby={error && `${name}-error`}
          defaultValue={defaultValue}
        />
        {suffix && <div className="ds-input-suffix">{suffix}</div>}
      </div>
      {error && (
        <InputError inputName={name}>
          {flattenedErrorCodes?.find((err) => err.code === error)?.text ??
            error}
        </InputError>
      )}
    </div>
  );
};

export default Input;
