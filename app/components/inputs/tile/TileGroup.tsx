import { type ReactNode, useState } from "react";
import { useStringField } from "~/services/validation/useStringField";
import TileRadio, { type TileOptions } from "./TileRadio";
import { type ErrorMessageProps } from "..";
import InputError from "../InputError";

type TileGroupProps = Readonly<{
  name: string;
  options: TileOptions[];
  label?: ReactNode;
  altLabel?: string;
  errorMessages?: ErrorMessageProps[];
  useTwoColumns?: boolean;
  formId?: string;
}>;

const TileGroup = ({
  name,
  options,
  label,
  altLabel,
  errorMessages,
  useTwoColumns,
  formId,
}: TileGroupProps) => {
  const { error, defaultValue } = useStringField(name, { formId });
  const errorId = `${name}-error`;
  const errorToDisplay =
    errorMessages?.find((err) => err.code === error)?.text ?? error;
  // Without JS, we need a same-named hidden field for validation without user input
  // It gets removed on clicking any Tile option to still allow for front-end validation
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
      <div
        className={`grid sm:grid-cols-1 gap-24 ${
          useTwoColumns ? "md:grid-cols-2" : "md:max-w-[630px]"
        }`}
      >
        {label && <legend>{label}</legend>}
        {options.map(({ value, description, tagDescription, image, title }) => (
          <TileRadio
            key={value}
            name={name}
            onClick={() => setRenderHiddenField(false)}
            value={value}
            description={description}
            tagDescription={tagDescription}
            image={image}
            title={title}
            formId={formId}
          />
        ))}
      </div>
      <div className="pt-16">
        {errorToDisplay && (
          <InputError id={errorId}>{errorToDisplay}</InputError>
        )}
      </div>
    </fieldset>
  );
};

export default TileGroup;
