import { useField } from "@rvf/react-router";
import TileTag, { type TileDescriptionProps } from "./TileTag";
import Image, { type ImageProps } from "../../common/Image";

const IMAGE_HEIGHT = 32;
const IMAGE_WIDTH = 32;

export type TileOptions = Readonly<
  {
    value: string;
    description?: string | null;
    title?: string;
    image?: ImageProps;
  } & TileDescriptionProps
>;

type TileProps = TileOptions &
  Readonly<{
    name: string;
    onClick: () => void;
    ref: React.Ref<HTMLInputElement>;
  }>;

const getAriaDescribedBy = (
  errorId: string,
  descriptionId: string,
  error: string | null,
  description: string | null | undefined,
) => {
  if (error) {
    return errorId;
  }

  if (description) {
    return descriptionId;
  }

  return undefined;
};

function TileRadio({
  name,
  description,
  value,
  title,
  image,
  tagDescription,
  onClick,
  ref,
}: TileProps) {
  const field = useField(name);
  const id = `${name}-${value}`;
  const errorId = `${name}-error`;
  const descriptionId = `${value}-description`;

  const ariaDescribedBy = getAriaDescribedBy(
    errorId,
    descriptionId,
    field.error(),
    description,
  );

  return (
    <div className="ds-tile-radio-group rounded-lg border-2 border-[#B3C9D6] bg-white">
      <label
        className="flex flex-row items-center cursor-pointer touch-manipulation p-24 h-full"
        htmlFor={id}
        aria-label={title}
      >
        <input
          {...field.getInputProps({ type: "radio", id, value })}
          className="ds-radio forced-colors:outline forced-colors:border-[ButtonText]"
          name={name}
          type="radio"
          aria-describedby={ariaDescribedBy}
          onClick={onClick}
          ref={ref}
        />
        <div className="h-full pl-24 flex flex-col gap-y-8">
          <div className="flex flex-row justify-between">
            {image && (
              <Image
                className={"brightness-0 invert-0"}
                {...image}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                ariaHidden={true}
              />
            )}
            <TileTag tagDescription={tagDescription} />
          </div>
          <div>
            <p className="ds-label-01-bold">{title}</p>
            {description && (
              <p id={descriptionId} className="ds-subhead ds-body-01-reg">
                {description}
              </p>
            )}
          </div>
        </div>
      </label>
    </div>
  );
}

export default TileRadio;
