import type { Renderer } from "marked";
import { useField } from "remix-validated-form";
import type { ExtraTileProps, TileProps } from "./TileGroup";
import TileTag from "./TileTag";
import Image from "../../Image";
import RichText from "../../RichText";

const paragraphRenderer: Partial<Renderer> = {
  paragraph(text) {
    return `<p class="ds-subhead">${text}</p>`;
  },
};

const IMAGE_HEIGHT = 32;
const IMAGE_WIDTH = 32;

const TileRadio = ({
  name,
  description,
  value,
  title,
  image,
  tagDescription,
  onClick,
  formId,
}: TileProps & ExtraTileProps) => {
  const { error, getInputProps } = useField(name, { formId });
  const id = `${name}-${value}`;

  return (
    <div className="ds-tile-radio-group rounded-lg border-2 border-[#B3C9D6] bg-white break-words">
      <label
        className={`flex flex-row items-center cursor-pointer touch-manipulation px-24 py-24 h-full`}
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
          <div>
            <span className="ds-label-01-bold">{title}</span>
          </div>
          {description && (
            <RichText
              className="ds-subhead"
              markdown={description}
              renderer={paragraphRenderer}
            />
          )}
        </div>
      </label>
    </div>
  );
};

export default TileRadio;
