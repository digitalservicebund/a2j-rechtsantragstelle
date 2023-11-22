import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import Image from "../Image";

type TileProps = {
  name: string;
  description?: string;
  value: string;
  onClick?: () => void;
  text?: ReactNode;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alternativeText?: string;
  };
};

const Tile = ({
  name,
  description,
  value,
  text,
  image,
  onClick,
}: TileProps) => {
  const { error, getInputProps } = useField(name);
  const id = `${name}-${value}`;

  return (
    <div className="flex">
      {image && <Image {...image} />}
      <input
        {...getInputProps({ type: "tile", id, value })}
        className="hidden"
        name={name}
        type="radio"
        aria-describedby={error && `${name}-error`}
        onClick={onClick}
      />
      <label
        className="flex flex-col p-4 border-2 border-gray-400 cursor-pointer"
        htmlFor={id}
      >
        <span className="ds-label-01-bold">{text}</span>
        <span className="ds-label-01-reg">{description}</span>
      </label>
    </div>
  );
};

export default Tile;
