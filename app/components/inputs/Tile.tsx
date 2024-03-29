import { z } from "zod";
import { useField } from "remix-validated-form";
import Image, { ImagePropsSchema } from "../Image";
import RichText from "../RichText";

export const TilePropsSchema = z.object({
  description: z.string().nullable().optional(),
  value: z.string(),
  title: z.string().optional(),
  image: ImagePropsSchema.optional(),
});

type TileProps = z.infer<typeof TilePropsSchema>;

const Tile = ({
  name,
  description,
  value,
  title,
  image,
  onClick,
}: TileProps & { readonly name: string; readonly onClick: () => void }) => {
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
          {image && <Image {...image} />}
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
