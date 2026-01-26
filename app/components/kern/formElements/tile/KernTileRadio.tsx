import { useField } from "@rvf/react-router";
import KernTileContent, { type KernTileContentProps } from "./KernTileContent";
import { type ImageProps } from "~/components/common/Image";

export type KernTileOptions = Readonly<{
  value: string;
  description?: string;
  title?: string;
  image?: ImageProps;
  tagDescription?: string;
  tileDescription?: string;
  tileTitle?: string;
}>;

type KernTileRadioProps = KernTileOptions &
  Readonly<
    {
      name: string;
      onClick: () => void;
      ref: React.Ref<HTMLInputElement>;
      image?: ImageProps;
    } & KernTileContentProps
  >;
const KernTileRadio = ({
  name,
  tileDescription,
  tagDescription,
  value,
  tileTitle,
  image,
  onClick,
  ref,
}: KernTileRadioProps) => {
  const field = useField(name);
  const id = `${name}-${value}`;
  const errorId = `${name}-error`;
  const descriptionId = tileDescription ? `${value}-description` : undefined;
  const ariaDescribedBy = field.error() ? errorId : descriptionId;

  return (
    <div className="flex rounded-lg border-2 border-[#171A2B] bg-[#F7F7F9]">
      <label
        className="flex flex-row items-center cursor-pointer touch-manipulation p-24 h-full"
        htmlFor={id}
        aria-label={tileTitle}
      >
        <div className="kern-form-check">
          <input
            {...field.getInputProps({ type: "radio", id, value })}
            className="kern-form-check__radio"
            name={name}
            type="radio"
            aria-describedby={ariaDescribedBy}
            onClick={onClick}
            ref={ref}
          />
        </div>
        <KernTileContent
          tileTitle={tileTitle}
          tileDescription={tileDescription}
          tagDescription={tagDescription}
          image={image}
        />
      </label>
    </div>
  );
};
export default KernTileRadio;
