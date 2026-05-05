import Image, { type ImageProps } from "~/components/common/Image";
import { GridItem } from "~/components/layout/grid/GridItem";
import { arrayIsNonEmpty } from "~/util/array";
import Label, { type LabelProps } from "./Label";
import BoxItem, { type BoxItemProps } from "./BoxItem";
import Button, { type ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";

type BoxProps = {
  identifier?: string;
  label?: LabelProps;
  heading?: HeadingProps;
  subline?: HeadingProps;
  content?: RichTextProps;
  buttons?: ButtonProps[];
  image?: ImageProps;
  items?: BoxItemProps[];
};

const Box = ({
  identifier,
  label,
  heading,
  subline,
  content,
  buttons,
  image,
  items,
}: BoxProps) => {
  const contentBlock = (
    <div className="flex flex-col">
      <div className="flex flex-col wrap-break-word gap-kern-space-default">
        {label && (
          <Label
            {...label}
            className="text-kern-layout-text-muted! font-normal! pt-0! pb-0!"
            aria-describedby={identifier ? `${identifier}-label` : undefined}
          />
        )}
        {heading && (
          <Heading {...heading} className="pt-0! pb-0!" managedByParent />
        )}
        {subline && <Heading {...subline} managedByParent />}
        {content && <RichText {...content} />}
      </div>
      {arrayIsNonEmpty(items) && (
        <div
          className="flex flex-col justify-start align-start gap-kern-space-x-large pt-kern-space-x-large"
          data-testid="box-item-container"
        >
          {items.map((item) => (
            <BoxItem key={item.id} {...item} />
          ))}
        </div>
      )}
      {arrayIsNonEmpty(buttons) && (
        <ButtonContainer className="kern-button-group pt-kern-space-default">
          {buttons.map((button) => (
            <Button key={button.text ?? button.href} {...button} />
          ))}
        </ButtonContainer>
      )}
    </div>
  );

  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      id={identifier}
    >
      <div className="flex flex-col gap-kern-space-small py-kern-space-x-large px-kern-space-large lg:px-0 xl:px-0">
        {image ? (
          <div className="flex flex-col lg:flex-row items-start gap-kern-space-large">
            <div className="shrink-0 max-w-full lg:max-w-[200px]">
              <Image {...image} />
            </div>
            <div className="flex-1 min-w-0">{contentBlock}</div>
          </div>
        ) : (
          contentBlock
        )}
      </div>
    </GridItem>
  );
};

export default Box;
