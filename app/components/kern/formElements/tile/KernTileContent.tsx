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
            className="forced-color-adjust-auto"
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
            className="kern-body kern-body--muted break-words"
          >
            {tileDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default KernTileContent;
