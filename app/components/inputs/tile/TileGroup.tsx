import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ReactNode, useState } from "react";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type ErrorMessageProps } from "..";
import TileRadio, { type TileOptions } from "./TileRadio";
import InputError from "../InputError";

export type TileGroupProps = Readonly<{
  name: string;
  options: TileOptions[];
  label?: ReactNode;
  altLabel?: string;
  errorMessages?: ErrorMessageProps[];
  useTwoColumns?: boolean;
}>;

const TileGroup = ({
  name,
  options,
  label,
  altLabel,
  errorMessages,
  useTwoColumns,
}: TileGroupProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;
  const errorToDisplay =
    errorMessages?.find((err) => err.code === field.error())?.text ??
    field.error();
  // Without JS, we need a same-named hidden field for validation without user input
  // It gets removed on clicking any Tile option to still allow for front-end validation
  const [renderHiddenField, setRenderHiddenField] = useState(
    field.defaultValue() === undefined,
  );
  const jsAvailable = useJsAvailable();

  return (
    <fieldset
      aria-invalid={field.error() !== undefined}
      aria-describedby={field.error() ? errorId : undefined}
      aria-errormessage={field.error() ? errorId : undefined}
    >
      {altLabel && <legend className="sr-only">{altLabel}</legend>}
      {(!jsAvailable || renderHiddenField) && (
        <input type="hidden" name={name} />
      )}
      <div
        className={classNames("grid gap-24", {
          "grid-cols-[repeat(auto-fit,minmax(290px,1fr))]": useTwoColumns,
        })}
      >
        {label && <legend>{label}</legend>}
        {options.map(
          ({ value, description, tagDescription, image, title }, index) => (
            <TileRadio
              key={value}
              name={name}
              onClick={() => setRenderHiddenField(false)}
              value={value}
              description={description}
              tagDescription={tagDescription}
              image={image}
              title={title}
              ref={
                index === 0 && field.error() ? field.refs.controlled() : null
              }
            />
          ),
        )}
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
