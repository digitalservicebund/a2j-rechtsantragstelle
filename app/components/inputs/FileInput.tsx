import { useField } from "remix-validated-form";
import InputError from "~/components/inputs/InputError";

export type FileInputProps = {
  name: string;
  label?: string;
};

export const FileInput = ({ name, label }: FileInputProps) => {
  const { error, getInputProps } = useField(name);
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        {...getInputProps({ id: name })}
        type="file"
        // accept=".pdf"
        aria-errormessage={error && errorId}
        aria-invalid={error !== undefined}
      ></input>
      {error && <InputError id={errorId}>{error}</InputError>}
    </div>
  );
};
