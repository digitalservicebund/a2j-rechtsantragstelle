import { useField } from "remix-validated-form";
import Image from "../../Image";
import RichText from "../../RichText";
import type { ExtraTileProps, TileProps } from "./TileGroup";
import type { Renderer } from "marked";
import TileTag from "./TileTag";
import classNames from "classnames";

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
    <div className="ds-tile-radio-group flex flex-row items-center rounded-lg border-2 border-[#B3C9D6] hover:border-[#004B76] hover:bg-[#F6F7F8] bg-white break-words">
      <div className="pl-12">
        <input
          {...getInputProps({ type: "radio", id, value })}
          className="ds-radio pl-12"
          name={name}
          type="radio"
          aria-describedby={error && `${name}-error`}
          onClick={onClick}
        />
      </div>

      <label
        className={`flex flex-col h-full cursor-pointer touch-manipulation !pt-24 pb-32 ${image ? "px-24" : "pr-32"}`}
        htmlFor={id}
      >
        <div className="flex flex-row items-center justify-between">
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
        {description && (
          <RichText
            className="ds-subhead"
            markdown={description}
            renderer={paragraphRenderer}
          />
        )}
      </label>
    </div>
  );
};

export default TileRadio;
