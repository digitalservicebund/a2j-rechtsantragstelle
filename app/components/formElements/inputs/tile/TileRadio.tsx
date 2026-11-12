import { useField } from "@rvf/react-router";
import TileContent from "./TileContent";
import { type ImageProps } from "~/components/common/Image";
import classNames from "classnames";

export type TileOptions = Readonly<{
  value: string;
  title: string;
  description?: string;
  image?: ImageProps;
}>;

type Props = TileOptions &
  Readonly<{
    name: string;
    ref: React.Ref<HTMLInputElement>;
    errorId?: string;
  }>;

const TileRadio = ({
  name,
  value,
  title,
  description,
  image,
  ref,
  errorId,
}: Props) => {
  const field = useField(name);
  const id = `${name}-${value}`;
  const ariaDescribedBy = field.error() ? errorId : undefined;

  return (
    <div
      className={classNames(
        "kern-tile flex rounded-lg border-2 border-kern-form-input-border bg-kern-white hover:ring-2 hover:ring-kern-form-input-border hover:ring-inset box-border",
        {
          "border-kern-feedback-danger": field.error() !== null,
        },
      )}
    >
      <label
        className="flex flex-row items-center cursor-pointer touch-manipulation p-kern-space-large h-full max-w-full"
        htmlFor={id}
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
        <TileContent title={title} description={description} image={image} />
      </label>
    </div>
  );
};
export default TileRadio;
