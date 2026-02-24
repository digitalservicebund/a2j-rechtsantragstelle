import Button, { type ButtonProps } from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import type { ImageProps } from "~/components/common/Image";
import RichText, { type RichTextProps } from "~/components/common/RichText";
import { GridItem } from "~/components/layout/grid/GridItem";
import { arrayIsNonEmpty } from "~/util/array";
import BoxWithImage from "./BoxWithImage";
import InfoBox from "./InfoBox";
import { type InfoBoxItemProps } from "./InfoBoxItem";

export type Variant = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export const variantWidths: Record<Variant, string> = {
  XS: "max-w-[80px]",
  S: "max-w-[120px]",
  M: "max-w-[280px]",
  L: "max-w-[400px]",
  XL: "max-w-[630px]",
  XXL: "max-w-[848px]",
};

type BoxProps = {
  identifier?: string;
  label?: HeadingProps;
  heading?: HeadingProps;
  content?: RichTextProps;
  buttons?: ButtonProps[];
  image?: ImageProps;
  variant?: Variant;
  items?: InfoBoxItemProps[];
  separator?: boolean;
  container?: {
    backgroundColor?: string;
  };
};

const Box = ({
  identifier,
  label,
  heading,
  content,
  buttons,
  image,
  variant,
  items,
  separator,
}: BoxProps) => {
  if (image && !arrayIsNonEmpty(items)) {
    return (
      <BoxWithImage
        identifier={identifier}
        heading={heading}
        image={image}
        content={content?.html}
        variant={variant}
      />
    );
  }

  if (arrayIsNonEmpty(items)) {
    return (
      <InfoBox
        identifier={identifier}
        heading={heading}
        separator={separator}
        items={items}
      />
    );
  }

  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="py-24 px-16 md:px-16 lg:px-0 xl:px-0"
      id={identifier}
    >
      <div className="ds-stack ds-stack-16 scroll-my-40">
        <div className="ds-stack ds-stack-8">
          {label && <Heading {...label} />}
          {heading && <Heading {...heading} />}
          {content && (
            <div>
              <RichText {...content} />
            </div>
          )}
        </div>
        {arrayIsNonEmpty(buttons) && (
          <ButtonContainer>
            {buttons.map((button) => (
              <Button key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
      </div>
    </GridItem>
  );
};

export default Box;
