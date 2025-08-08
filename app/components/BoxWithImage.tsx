import GridContainer, { GridItem } from "./GridContainer";
import Heading, { type HeadingProps } from "./Heading";
import Image, { type ImageProps } from "./Image";
import RichText from "./RichText";

type BoxWithImageProps = {
  image: ImageProps;
  variant?: Variant;
  identifier?: string;
  heading?: HeadingProps;
  content?: string;
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
  variant = "S",
  identifier,
  heading,
  image,
  content,
}: BoxWithImageProps) => {
  const shouldWrapByDefault = variant === "XL" || variant === "XXL";
  const hasTextContent = Boolean(heading ?? content);
  return (
    <GridContainer
      columns={12}
      maxWidth="xl"
      alignItems="start"
      paddingX="sm"
      justifyContent="start"
    >
      <GridItem span={12} colStart={1}>
        <div
          id={identifier}
          className={`flex flex-wrap ${shouldWrapByDefault ? "md:flex-wrap" : "sm:flex-nowrap"} items-start gap-24 text-base`}
        >
          <div
            className={`shrink-0 overflow-hidden ${hasTextContent ? variantWidths[variant] : "max-w-full"}`}
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
    </GridContainer>
  );
};

export default BoxWithImage;
