import { useField } from "remix-validated-form";
import { type ImageProps } from "../Image";
import RichText from "../RichText";

export type TileProps = Readonly<{
  name: string;
  onClick: () => void;
  value: string;
  description?: string | null;
  title?: string;
  image?: React.ReactElement<ImageProps>;
}>;

const Tile = ({
  name,
  description,
  value,
  title,
  image,
  onClick,
}: TileProps) => {
  const { error, getInputProps } = useField(name);
  const id = `${name}-${value}`;

  return (
    <div className="ds-tile">
      <input
        {...getInputProps({ type: "radio", id, value })}
        className="opacity-0 fixed w-0"
        name={name}
        type="radio"
        aria-describedby={error && `${name}-error`}
        onClick={onClick}
      />
      <label
        className={`flex flex-col py-24 px-32 h-full rounded-lg border-2 border-[#B3C9D6] hover:border-[#004B76] hover:bg-[#F6F7F8] bg-white break-words ${
          image ? "pb-32 px-40" : ""
        }`}
        htmlFor={id}
      >
        <div className="ds-label-01-bold flex flex-row space-x-8 items-center">
          {image}
          <span>{title}</span>
        </div>
        {description && (
          <RichText className="ds-label-03-reg" markdown={description} />
        )}
      </label>
    </div>
  );
};

export default Tile;
