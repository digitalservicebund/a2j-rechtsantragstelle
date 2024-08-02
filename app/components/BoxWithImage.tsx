import Heading, { type HeadingProps } from "./Heading";
import Image, { type ImageProps } from "./Image";
import RichText from "./RichText";

export type BoxWithImageProps = {
  image: ImageProps;
  identifier?: string;
  heading?: HeadingProps;
  imageLabel?: string;
  content?: string;
};

const BoxWithImage = ({
  identifier,
  heading,
  image,
  imageLabel,
  content,
}: BoxWithImageProps) => {
  return (
    <div
      id={identifier}
      className="flex flex-row items-start gap-32 max-[499px]:flex-col"
    >
      <div className="ds-stack-16">
        {imageLabel && (
          <p className="ds-label-section pt-4 text-gray-800">{imageLabel}</p>
        )}
        <Image
          {...image}
          {...{
            className: content ? "w-[160px]" : "max-w-none",
          }}
        />
      </div>
      <div className={"ds-stack-8 break-words w-full"}>
        {heading && <Heading {...heading} />}
        {content && <RichText markdown={content} />}
      </div>
    </div>
  );
};

export default BoxWithImage;
