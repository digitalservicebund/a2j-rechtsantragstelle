import { useField } from "@rvf/react-router";
import KernTileContent, { type KernTileContentProps } from "./KernTileContent";
import { type ImageProps } from "~/components/common/Image";
import classNames from "classnames";

export type KernTileOptions = Readonly<{
  value: string;
  description?: string;
  title?: string;
  image?: ImageProps;
  tileDescription?: string;
  tileTitle?: string;
  errorId?: string;
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
  value,
  tileTitle,
  image,
  onClick,
  ref,
  errorId,
}: KernTileRadioProps) => {
  const field = useField(name);
  const id = `${name}-${value}`;
  const descriptionId = tileDescription ? `${value}-description` : undefined;
  const ariaDescribedBy = field.error() ? errorId : descriptionId;

  return (
    <div
      className={classNames(
        "kern-tile flex rounded-lg border-2 border-kern-form-input-border bg-kern-form-input-background-inverted hover:ring-2 hover:ring-kern-form-input-border hover:ring-inset box-border",
        {
          "border-kern-feedback-danger": field.error() !== null,
        },
      )}
    >
      <label
        className="flex flex-row items-center cursor-pointer touch-manipulation p-kern-space-large h-full max-w-full"
        htmlFor={id}
        aria-label={tileTitle}
      >
        <div className="kern-form-check">
          <input
            {...field.getInputProps({ type: "radio", id, value })}
            className={classNames("kern-form-check__radio", {
              "kern-form-check__radio--error": field.error() !== null,
            })}
            name={name}
            type="radio"
            aria-describedby={ariaDescribedBy}
            onClick={onClick}
            ref={ref}
          />
        </div>
        <KernTileContent
          title={tileTitle}
          description={tileDescription}
          image={image}
        />
      </label>
    </div>
  );
};
export default KernTileRadio;
