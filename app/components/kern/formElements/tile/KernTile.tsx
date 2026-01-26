import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ReactNode, useState } from "react";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type ErrorMessageProps } from "~/components/common/types";
import KernTileRadio, { type KernTileOptions } from "./KernTileRadio";
import { KernIcon } from "~/components/kern/common/KernIcon";

type KernTileProps = Readonly<{
  name: string;
  options: KernTileOptions[];
  label?: ReactNode;
  altLabel?: string;
  errorMessages?: ErrorMessageProps[];
  useTwoColumns?: boolean;
}>;

const KernTile = ({
  name,
  options,
  label,
  altLabel,
  errorMessages,
  useTwoColumns,
}: KernTileProps) => {
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
      aria-invalid={field.error() !== null}
      aria-errormessage={field.error() ? errorId : undefined}
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": field.error() !== null,
      })}
    >
      {altLabel && <legend className="sr-only">{altLabel}</legend>}

      {(!jsAvailable || renderHiddenField) && (
        <input type="hidden" name={name} />
      )}
      <div
        className={classNames("grid gap-24", {
          "grid-cols-[repeat(auto-fit,minmax(18.125rem,1fr))]": useTwoColumns,
        })}
      >
        {label && (
          <legend className="kern-label kern-label--large">{label}</legend>
        )}
        {options.map(
          ({ value, description, tagDescription, image, title }, index) => (
            <KernTileRadio
              key={value}
              name={name}
              onClick={() => setRenderHiddenField(false)}
              value={value}
              tileDescription={description}
              tileTitle={title}
              tagDescription={tagDescription}
              image={image}
              ref={
                index === 0 && field.error() ? field.refs.controlled() : null
              }
            />
          ),
        )}
      </div>
      <div className="pt-16 pb-16">
        {errorToDisplay && (
          <p className="kern-error" id={errorId} role="alert">
            <KernIcon
              name="emergency-home"
              className="fill-kern-feedback-danger!"
            />
            <span className="text-kern-feedback-danger" id={errorId}>
              {errorToDisplay}
            </span>
          </p>
        )}
      </div>
    </fieldset>
  );
};

export default KernTile;
