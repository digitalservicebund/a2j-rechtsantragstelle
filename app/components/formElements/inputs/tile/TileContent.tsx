import classNames from "classnames";
import Image from "~/components/common/Image";
import { type TileOptions } from "./TileRadio";

const IMAGE_HEIGHT = 32;
const IMAGE_WIDTH = 32;

const TileContent = ({
  title,
  description,
  image,
}: Omit<TileOptions, "value">) => {
  return (
    <div
      className={classNames("h-full flex flex-col", {
        "gap-y-kern-space-small max-w-[calc(100%-1.5rem)]": image,
      })}
    >
      <div className="flex flex-row justify-between">
        {image && (
          <Image
            {...image}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            ariaHidden={true}
          />
        )}
      </div>
      <div>
        <h2 className="kern-body kern-body--bold">{title}</h2>
        {description && (
          <p className="kern-body kern-body--muted">{description}</p>
        )}
      </div>
    </div>
  );
};

export default TileContent;
