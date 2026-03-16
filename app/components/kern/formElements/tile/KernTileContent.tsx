import classNames from "classnames";
import Image, { type ImageProps } from "~/components/common/Image";

const IMAGE_HEIGHT = 32;
const IMAGE_WIDTH = 32;

export type KernTileContentProps = {
  readonly tileDescription?: string;
  readonly tileTitle?: string;
  readonly image?: ImageProps;
};

const KernTileContent = ({
  tileTitle,
  tileDescription,
  image,
}: KernTileContentProps) => {
  return (
    <div
      className={classNames("h-full flex flex-col", {
        "gap-y-kern-space-small": image,
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
        {tileTitle && (
          <h3 className="kern-body kern-body--bold">{tileTitle}</h3>
        )}
        {tileDescription && (
          <p
            id={tileDescription ? `${tileTitle}-description` : undefined}
            className="kern-body kern-body--muted"
          >
            {tileDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default KernTileContent;
