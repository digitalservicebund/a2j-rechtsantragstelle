import { type ReactNode, useState } from "react";
import { useField } from "remix-validated-form";
import InputError from "./InputError";
import Tile, { TilePropsSchema } from "./Tile";
import { z } from "zod";
import { ErrorMessagePropsSchema } from ".";

export const TileGroupPropsSchema = z.object({
  name: z.string(),
  options: z.array(TilePropsSchema),
  label: z.custom<ReactNode>().optional(),
  altLabel: z.string().optional(),
  errorMessages: z.array(ErrorMessagePropsSchema).optional(),
  useTwoColumns: z.boolean().optional(),
});

type TileGroupProps = z.infer<typeof TileGroupPropsSchema>;

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
          useTwoColumns ? "md:max-w-[630px] md:grid-cols-2" : ""
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
