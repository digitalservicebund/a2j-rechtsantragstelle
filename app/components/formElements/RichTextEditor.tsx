import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { Details } from "~/components/content/Details";
import RichText from "~/components/common/RichText";
import type { ErrorMessageProps } from "~/components/common/types";
import InputError from "~/components/formElements/InputError";
import InputLabel from "~/components/formElements/InputLabel";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";

import { PlateRichTextEditor } from "./RichTextEditor/PlateRichTextEditor";

type Props = Readonly<{
  name: string;
  label?: React.ReactNode;
  description?: string;
  details?: {
    title: string;
    content: string;
  };
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
}>;

export default function RichTextEditor({
  name,
  label,
  description,
  details,
  placeholder,
  errorMessages,
}: Props) {
  const field = useField<string>(name);
  const errorId = `${name}-error`;

  const jsAvailable = useJsAvailable();
  const markdown = field.value() ?? "";

  return (
    <div className="ds-stack ds-stack-8">
      {label && (
        <InputLabel classname="ds-label-01-reg" id={name}>
          {label}
        </InputLabel>
      )}

      {description && (
        <RichText className="ds-body-02-reg text-gray-900" html={description} />
      )}

      {details && <Details {...details} />}

      {jsAvailable ? (
        <PlateRichTextEditor
          initialMarkdown={markdown}
          placeholder={placeholder}
          invalid={field.error() !== null}
          describedBy={errorId}
          errorMessage={errorId}
          onChangeMarkdown={(nextMarkdown: string) =>
            field.setValue(nextMarkdown)
          }
          onBlurValidate={() => field.validate()}
        />
      ) : (
        <textarea
          className={classNames(
            "mt-8 rounded border p-12 min-h-[120px]",
            field.error() ? "border-red-600" : "border-gray-300",
          )}
          value={markdown}
          onChange={(e) => field.setValue(e.target.value)}
          onBlur={() => field.validate()}
          placeholder={placeholder}
          aria-invalid={field.error() !== null}
          aria-describedby={field.error() ? errorId : undefined}
        />
      )}

      <input type="hidden" name={name} value={field.value() ?? ""} readOnly />

      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
}
