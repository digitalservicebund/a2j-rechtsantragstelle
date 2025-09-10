import Heading, { type HeadingProps } from "~/components/common/Heading";
import Image, { type ImageProps } from "~/components/common/Image";
import RichText from "~/components/common/RichText";
import { Grid } from "../layout/grid/Grid";
import { GridItem } from "../layout/grid/GridItem";

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
  identifier,
  heading,
  image,
  content,
}: BoxWithImageProps) => {
  const hasTextContent = Boolean(heading ?? content);
  return (
    <Grid className="mt-32 mb-32">
      <GridItem
        span={12}
        mdSpan={2}
        mdStart={1}
        lgStart={3}
        lgSpan={2}
        xlStart={3}
        xlSpan={2}
        id={identifier}
      >
        <div>
          <Image {...image} />
        </div>
      </GridItem>
      <GridItem
        span={12}
        mdSpan={6}
        mdStart={3}
        lgStart={5}
        lgSpan={7}
        xlStart={5}
        xlSpan={7}
        id={identifier}
      >
        {hasTextContent && (
          <div className="ds-stack ds-stack-8 break-words min-w-[120px] max-w-[696px]">
            {heading && <Heading {...heading} />}
            {content && <RichText html={content} />}
          </div>
        )}
      </GridItem>
    </Grid>
  );
};

export default BoxWithImage;
