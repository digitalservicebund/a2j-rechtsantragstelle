import { useState } from "react";
import { useField } from "remix-validated-form";
import InputError from "./InputError";
import Tile, { type TileProps } from "./Tile";
import { type ErrorMessageProps } from "./ErrorMessageProps";

type TileGroupProps = Readonly<{
  name: string;
  options: Omit<TileProps, "name" | "onClick">[];
  altLabel?: string | null;
  label?: string | null;
  errorMessages?: ErrorMessageProps[];
  useTwoColumns?: boolean | null;
}>;

const TileGroup = ({
  name,
  options,
  label,
  altLabel,
  errorMessages,
  useTwoColumns,
}: TileGroupProps) => {
  const { error, defaultValue } = useField(name);
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
        className={`grid sm:grid-cols-1 gap-16 ${
          useTwoColumns ? "md:grid-cols-2" : "md:max-w-[630px]"
        }`}
      >
        {label && <legend>{label}</legend>}
        {options.map((option) => (
          <Tile
            key={option.value}
            description={option.description}
            name={name}
            value={option.value}
            title={option.title}
            onClick={() => setRenderHiddenField(false)}
            image={option.image}
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
