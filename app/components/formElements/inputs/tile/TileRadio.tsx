import { useField } from "@rvf/react-router";
import TileContent, { type TileContentProps } from "./TileContent";
import { type ImageProps } from "~/components/common/Image";
import classNames from "classnames";

export type TileOptions = Readonly<{
  value: string;
  description?: string;
  title?: string;
  image?: ImageProps;
  tileDescription?: string;
  tileTitle?: string;
  errorId?: string;
}>;

type TileRadioProps = TileOptions &
  Readonly<
    {
      name: string;
      ref: React.Ref<HTMLInputElement>;
      image?: ImageProps;
    } & TileContentProps
  >;
const TileRadio = ({
  name,
  tileDescription,
  value,
  tileTitle,
  image,
  ref,
  errorId,
}: TileRadioProps) => {
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
            ref={ref}
          />
        </div>
        <TileContent
          title={tileTitle}
          description={tileDescription}
          image={image}
          descriptionId={descriptionId}
        />
      </label>
    </div>
  );
};
export default TileRadio;
