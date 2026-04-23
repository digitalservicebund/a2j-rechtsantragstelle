import type { ImageProps } from "~/components/common/Image";
import { GridItem } from "~/components/layout/grid/GridItem";
import { arrayIsNonEmpty } from "~/util/array";
import BoxWithImage, { type Variant } from "./BoxWithImage";
import InfoBox from "./InfoBox";
import { type InfoBoxItemProps } from "./InfoBoxItem";
import KernButtonContainer from "../kern/KernButtonContainer";
import KernButton, { type ButtonProps } from "../kern/KernButton";
import KernHeading, { type KernHeadingProps } from "../kern/KernHeading";
import KernRichText, { type RichTextProps } from "../kern/KernRichText";

type BoxProps = {
  identifier?: string;
  label?: KernHeadingProps;
  heading?: KernHeadingProps;
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
          {label && <KernHeading {...label} />}
          {heading && <KernHeading {...heading} />}
          {content && (
            <div>
              <KernRichText {...content} />
            </div>
          )}
        </div>
        {arrayIsNonEmpty(buttons) && (
          <KernButtonContainer>
            {buttons.map((button) => (
              <KernButton key={button.text ?? button.href} {...button} />
            ))}
          </KernButtonContainer>
        )}
      </div>
    </GridItem>
  );
};

export default Box;
