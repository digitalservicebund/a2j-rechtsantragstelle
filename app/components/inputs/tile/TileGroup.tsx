import { type ReactNode, useState } from "react";
import { useStringField } from "~/services/validation/useStringField";
import InputError from "../InputError";
import Tile from "./Tile";
import { type ErrorMessageProps } from "..";
import type { ImageProps } from "~/components/Image";
import TileRadioGroup from "./TileRadioGroup";

type TileGroupProps = Readonly<{
  name: string;
  options: TileProps[];
  label?: ReactNode;
  altLabel?: string;
  errorMessages?: ErrorMessageProps[];
  useTwoColumns?: boolean;
  showRadioButtonTiles: boolean;
}>;

export type TileProps = Readonly<{
  value: string;
  description?: string | null;
  title?: string;
  image?: ImageProps;
  tagDescription?: string;
}>;

export type ExtraTileProps = Readonly<{
  name: string;
  onClick: () => void;
}>;

const renderTile = ({
  name,
  onClick,
  showRadioButtonTiles,
  value,
  description,
  image,
  tagDescription,
  title,
}: TileProps &
  ExtraTileProps &
  Pick<TileGroupProps, "showRadioButtonTiles">) => {
  if (showRadioButtonTiles) {
    return (
      <TileRadioGroup
        key={value}
        name={name}
        onClick={onClick}
        value={value}
        description={description}
        image={image}
        title={title}
      />
    );
  }

  return (
    <Tile
      key={value}
      description={description}
      name={name}
      value={value}
      title={title}
      onClick={() => onClick}
      image={image}
    />
  );
};

const TileGroup = ({
  name,
  options,
  label,
  altLabel,
  errorMessages,
  useTwoColumns,
  showRadioButtonTiles,
}: TileGroupProps) => {
  const { error, defaultValue } = useStringField(name);
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
        {options.map((option) =>
          renderTile({
            name,
            onClick: () => setRenderHiddenField(false),
            showRadioButtonTiles,
            value: option.value,
            description: option.description,
            image: option.image,
            tagDescription: option.tagDescription,
            title: option.title,
          }),
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
