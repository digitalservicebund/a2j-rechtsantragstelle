import { useField } from "remix-validated-form";
import TileTag, { type TileDescriptionProps } from "./TileTag";
import Image, { type ImageProps } from "../../Image";
import RichText from "../../RichText";

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
    formId?: string;
  }>;

const TileRadio = ({
  name,
  description,
  value,
  title,
  image,
  tagDescription,
  onClick,
  formId,
}: TileProps) => {
  const { error, getInputProps } = useField(name, { formId });
  const id = `${name}-${value}`;

  return (
    <div className="ds-tile-radio-group rounded-lg border-2 border-[#B3C9D6] bg-white">
      <label
        className="flex flex-row items-center cursor-pointer touch-manipulation p-24 h-full"
        htmlFor={id}
      >
        <input
          {...getInputProps({ type: "radio", id, value })}
          className="ds-radio"
          name={name}
          type="radio"
          aria-describedby={error && `${name}-error`}
          onClick={onClick}
        />
        <div className="h-full pl-24 space-y-8">
          <div className="flex flex-row justify-between">
            {image && (
              <Image
                className={"brightness-0 invert-0"}
                {...image}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
              />
            )}
            <TileTag tagDescription={tagDescription} />
          </div>
          <span className="ds-label-01-bold">{title}</span>
          {description && <RichText html={description} />}
        </div>
      </label>
    </div>
  );
};

export default TileRadio;
