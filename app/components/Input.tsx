import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import { InputError, InputLabel } from "~/components";
import type { PageContent, ElementContent } from "~/services/cms/getPageConfig";
import invariant from "tiny-invariant";

type InputProps = {
  name: string;
  label?: ReactNode;
  type?: string;
  step?: string;
  pageContent?: PageContent;
};

const Input = ({
  name,
  label,
  type = "text",
  step,
  pageContent,
}: InputProps) => {
  const { error, getInputProps } = useField(name);

  const inputClassName = classNames("ds-input", {
    "has-error": error,
  });

  let fieldContentTemp: ElementContent | undefined = undefined;
  // TODO remove once all pages are converted to use Strapi
  if (pageContent) {
    invariant(
      pageContent,
      `pageContent must not be undefined for field ${name}`
    );
    fieldContentTemp = pageContent.find((o) => "name" in o && o.name == name);
    invariant(
      fieldContentTemp,
      `fieldContent must not be undefined for field ${name}`
    );
    invariant(
      fieldContentTemp.__component == "form-elements.input",
      `must be input field ${name}`
    );
  }
  // TODO how do you do this smoothly?
  const fieldContent = fieldContentTemp;
  const errorText = fieldContent?.errors.find((e) => e.code == error)?.text;

  return (
    <div>
      {label ? (
        <InputLabel id={name}>{fieldContent?.label || label}</InputLabel>
      ) : (
        ""
      )}

      <input
        {...getInputProps({ type, step, id: name })}
        className={inputClassName}
        aria-describedby={error ? `${name}-error` : undefined}
      />

      {error ? <InputError inputName={name}>{errorText}</InputError> : ""}
    </div>
  );
};

export default Input;
