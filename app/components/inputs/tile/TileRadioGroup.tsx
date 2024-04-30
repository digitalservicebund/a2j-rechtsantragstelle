import { useField } from "remix-validated-form";
import Image from "../../Image";
import RichText from "../../RichText";
import type { ExtraTileProps, TileProps } from "./TileGroup";
import type { Renderer } from "marked";

const paragraphRenderer: Partial<Renderer> = {
  paragraph(text) {
    return `<p class="ds-subhead">${text}</p>`;
  },
};

const TileRadioGroup = ({
  name,
  description,
  value,
  title,
  image,
  onClick,
}: TileProps & ExtraTileProps) => {
  const { error, getInputProps } = useField(name);
  const id = `${name}-${value}`;

  return (
    <div className="flex flex-row items-center py-24 pl-12 h-full rounded-lg border-2 border-[#B3C9D6] hover:border-[#004B76] hover:bg-[#F6F7F8] bg-white break-words">
      <input
        {...getInputProps({ type: "radio", id, value })}
        className="ds-radio"
        name={name}
        type="radio"
        aria-describedby={error && `${name}-error`}
        onClick={onClick}
      />
      <label className={`${image ? "pb-32 px-40" : ""}`} htmlFor={id}>
        <div className="flex flex-row space-x-8 items-center">
          {image && <Image {...image} />}
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

export default TileRadioGroup;
