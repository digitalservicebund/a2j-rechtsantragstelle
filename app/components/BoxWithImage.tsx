import Heading, { type HeadingProps } from "./Heading";
import Image, { type ImageProps } from "./Image";
import RichText from "./RichText";

export type BoxWithImageProps = {
  image: ImageProps;
  variant?: "default" | "easyLanguage";
  identifier?: string;
  heading?: HeadingProps;
  imageLabel?: string;
  content?: string;
};

const variantStyles = {
  default: {
    textSize: "1rem",
    headingSize: "1.625rem",
    imageWidth: "w-[160px]",
  },
  easyLanguage: {
    textSize: "20px",
    headingSize: "30px",
    imageWidth: "w-[320px]",
  },
} as const;

const BoxWithImage = ({
  variant = "default",
  identifier,
  heading,
  image,
  imageLabel,
  content,
}: BoxWithImageProps) => {
  return (
    <div
      id={identifier}
      className="flex flex-row items-start gap-24 max-[499px]:flex-col"
    >
      <div
        className={`ds-stack-16 ${content ? variantStyles[variant].imageWidth : "max-w-none"}`}
      >
        {imageLabel && (
          <p className="ds-label-section pt-4 text-gray-800">{imageLabel}</p>
        )}
        <Image {...image} />
      </div>
      <div className={"ds-stack-8 break-words w-full"}>
        {heading && (
          <div style={{ fontSize: variantStyles[variant].headingSize }}>
            <Heading {...heading} />
          </div>
        )}
        {content && (
          <div style={{ fontSize: variantStyles[variant].textSize }}>
            <RichText markdown={content} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BoxWithImage;
