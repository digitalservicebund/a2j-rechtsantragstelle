import Heading, { type HeadingProps } from "~/components/common/Heading";
import Image, { type ImageProps } from "~/components/common/Image";
import RichText from "~/components/common/RichText";
import { GridItem } from "../layout/grid/GridItem";

type BoxWithImageProps = {
  image: ImageProps;
  variant?: Variant;
  identifier?: string;
  heading?: HeadingProps;
  content?: string;
  container?: {
    backgroundColor?: string;
  };
};

export type Variant = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export const variantWidths: Record<Variant, string> = {
  XS: "max-w-[80px]",
  S: "max-w-[120px]",
  M: "max-w-[280px]",
  L: "max-w-[400px]",
  XL: "max-w-[630px]",
  XXL: "max-w-[848px]",
};

const BoxWithImage = ({
  identifier,
  heading,
  image,
  content,
  variant = "S",
}: BoxWithImageProps) => {
  const hasTextContent = Boolean(heading ?? content);
  const shouldWrapByDefault = variant === "XL" || variant === "XXL";
  return (
    <GridItem
      smColumn={{ start: 1, span: 12 }}
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="py-24 px-16 md:px-16 lg:px-0 xl:px-0"
      id={identifier}
    >
      <div
        className={`flex flex-wrap ${shouldWrapByDefault ? "md:flex-wrap" : "sm:flex-nowrap"} items-start gap-24 text-base overflow-hidden`}
      >
        <div
          className={`shrink-0 ${hasTextContent ? variantWidths[variant] : "max-w-full"}`}
        >
          <Image {...image} />
        </div>
        {hasTextContent && (
          <div className="ds-stack ds-stack-8 break-words min-w-[120px] max-w-[696px]">
            {heading && <Heading {...heading} />}
            {content && <RichText html={content} />}
          </div>
        )}
      </div>
    </GridItem>
  );
};

export default BoxWithImage;
