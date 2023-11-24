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
    <div className="ds-tile">
      {image && <Image {...image} />}
      <input
        {...getInputProps({ type: "radio", id, value })}
        className="opacity-0 fixed w-0"
        name={name}
        type="radio"
        aria-describedby={error && `${name}-error`}
        onClick={onClick}
      />
      <label
        className="flex flex-col p-16 rounded-lg border-2 border-[#B3C9D6] hover:border-[#004B76] hover:bg-[#ECF1F4] bg-white"
        htmlFor={id}
      >
        <div className="ds-label-01-bold">{text}</div>
        <div className="ds-label-01-reg">{description}</div>
      </label>
    </div>
  );
};

export default Tile;
