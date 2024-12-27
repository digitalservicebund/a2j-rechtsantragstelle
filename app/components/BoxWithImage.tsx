import Heading, { type HeadingProps } from "./Heading";
import Image, { type ImageProps } from "./Image";
import RichText from "./RichText";

export type BoxWithImageProps = {
  image: ImageProps;
  variant?: keyof typeof variantWidths;
  identifier?: string;
  heading?: HeadingProps;
  content?: string;
};

const variantWidths = {
  // TODO: Remove after variant implementation
  default: {
    imageMaxWidth: "max-w-[120px]",
  },
  ImgMTextL: {
    imageMaxWidth: "max-w-[280px]",
  },
  XS: {
    imageMaxWidth: "max-w-[80px]",
  },
  S: {
    imageMaxWidth: "max-w-[120px]",
  },
  M: {
    imageMaxWidth: "max-w-[280px]",
  },
  L: {
    imageMaxWidth: "max-w-[400px]",
  },
  XL: {
    imageMaxWidth: "max-w-[630px]",
  },
  XXL: {
    imageMaxWidth: "max-w-[848px]",
  },
};

const BoxWithImage = ({
  variant = "default",
  identifier,
  heading,
  image,
  content,
}: BoxWithImageProps) => {
  const shouldWrapByDefault = variant === "XL" || variant === "XXL";
  return (
    <div
      id={identifier}
      className={`flex flex-wrap ${shouldWrapByDefault ? "md:flex-wrap" : "sm:flex-nowrap"} items-start gap-24 text-base`}
    >
      <div
        className={`lg:shrink-0 overflow-hidden ${content ? variantWidths[variant].imageMaxWidth : "max-w-full"}`}
      >
        <Image {...image} />
      </div>
      <div className={`ds-stack-8 break-words min-w-[120px] max-w-[696px]`}>
        {heading && <Heading {...heading} />}
        {content && <RichText markdown={content} />}
      </div>
    </div>
  );
};

export default BoxWithImage;
