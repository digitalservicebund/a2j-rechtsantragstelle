import Image, { type ImageProps } from "~/components/common/Image";

const IMAGE_HEIGHT = 32;
const IMAGE_WIDTH = 32;

export type KernTileContentProps = {
  readonly tagDescription?: string;
  readonly tileDescription?: string;
  readonly tileTitle?: string;
  readonly image?: ImageProps;
};

const KernTileContent = ({
  tileTitle,
  tileDescription,
  tagDescription,
  image,
}: KernTileContentProps) => {
  return (
    <div className="h-full pl-24 flex flex-col gap-y-8">
      <div className="flex flex-row justify-between">
        {image && (
          <Image
            {...image}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            ariaHidden={true}
          />
        )}
        {tagDescription && (
          <span className="max-h-24 bg-blue-300 px-8 py-4 text-blue-800 rounded-sm">
            {tagDescription}
          </span>
        )}
      </div>
      <div>
        {tileTitle && (
          <h3 className="font-semibold text-gray-900">{tileTitle}</h3>
        )}
        {tileDescription && (
          <p
            id={tileDescription ? `${tileTitle}-description` : undefined}
            className="text-gray-700 mt-4 whitespace-pre-line"
          >
            {tileDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default KernTileContent;
