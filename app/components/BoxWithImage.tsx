import Heading, { type HeadingProps } from "./Heading";
import Image, { type ImageProps } from "./Image";
import RichText from "./RichText";

export type BoxWithImageProps = {
  image: ImageProps;
  variant?: "default" | "ImgMTextL";
  identifier?: string;
  heading?: HeadingProps;
  content?: string;
};

const variantStyles = {
  default: {
    textSize: "1rem",
    imageContainer: "basis-1/6",
    columnBreakpoint: "md",
  },
  ImgMTextL: {
    textSize: "1.25rem",
    imageContainer: "basis-1/3",
    columnBreakpoint: "lg",
  },
} as const;

const BoxWithImage = ({
  variant = "default",
  identifier,
  heading,
  image,
  content,
}: BoxWithImageProps) => {
  return (
    <div
      id={identifier}
      className={`flex flex-col items-start gap-24 ${variantStyles[variant].columnBreakpoint}:flex-row`}
      style={{ fontSize: variantStyles[variant].textSize }}
    >
      <div
        className={`shrink-0 overflow-hidden max-w-[70ch] ${content ? variantStyles[variant].imageContainer : "basis-full"}`}
      >
        <Image {...image} />
      </div>
      <div className={"ds-stack-8 break-words basis-auto"}>
        {heading && <Heading {...heading} />}
        {content && <RichText markdown={content} />}
      </div>
    </div>
  );
};

export default BoxWithImage;
