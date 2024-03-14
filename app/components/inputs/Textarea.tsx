import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import type { ErrorMessageProps } from "./ErrorMessageProps";

type TextareaProps = Readonly<{
  name: string;
  label?: ReactNode;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
}>;

const Textarea = ({
  name,
  label,
  placeholder,
  errorMessages,
}: TextareaProps) => {
  const { error, getInputProps } = useField(name);
  const errorId = `${name}-error`;

  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <textarea
        {...getInputProps({
          id: name,
          placeholder: placeholder ?? undefined,
        })}
        className={classNames("ds-textarea placeholder-gray-600", {
          "has-error": error,
        })}
        aria-invalid={error !== undefined}
        aria-describedby={error && errorId}
        aria-errormessage={error && errorId}
      />
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </div>
  );
};

export default Textarea;
