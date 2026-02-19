import KernButton, { type ButtonProps } from "~/components/kern/KernButton";
import Image, { type ImageProps } from "~/components/common/Image";
import ButtonContainer from "~/components/common/ButtonContainer";
import KernHeading, {
  type KernHeadingProps,
} from "~/components/kern/KernHeading";
import KernRichText, {
  type RichTextProps,
} from "~/components/kern/KernRichText";
import { GridItem } from "~/components/layout/grid/GridItem";
import { arrayIsNonEmpty } from "~/util/array";
import KernLabel, { type KernLabelProps } from "./KernLabel";
import classNames from "classnames";
import KernBoxItem, { type KernBoxItemProps } from "./KernBoxItem";
import { SectionBackgroundColor } from "..";

type BoxProps = {
  identifier?: string;
  label?: KernLabelProps;
  heading?: KernHeadingProps;
  content?: RichTextProps;
  buttons?: ButtonProps[];
  image?: ImageProps;
  items?: KernBoxItemProps[];
};

const KernBox = ({
  identifier,
  label,
  heading,
  content,
  buttons,
  image,
  items,
}: BoxProps) => {
  const contentBlock = (
    <div className="flex flex-col ">
      <div className="flex flex-col wrap-break-word">
        {label && (
          <KernLabel
            {...label}
            className="text-kern-layout-text-muted! font-normal! pt-6! pb-2!"
          />
        )}
        {heading && (
          <KernHeading
            {...heading}
            className={classNames("pt-9! pb-7!", {
              "text-kern-adaptive-medium!": image,
            })}
            managedByParent
          />
        )}
        {content && <KernRichText {...content} />}
      </div>
      {arrayIsNonEmpty(items) && (
        <div
          className="flex flex-col justify-start align-start gap-kern-space-x-large"
          data-testid="box-item-container"
        >
          {items.map((item) => (
            <KernBoxItem key={item.id} {...item} />
          ))}
        </div>
      )}
      {arrayIsNonEmpty(buttons) && (
        <ButtonContainer className="kern-button-group pt-kern-space-small">
          {buttons.map((button) => (
            <KernButton key={button.text ?? button.href} {...button} />
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
      <div className="flex flex-col gap-kern-space-small py-kern-space-x-large px-kern-space-default">
        {image ? (
          <div className="flex flex-col lg:flex-row items-start gap-kern-space-large">
            <div className="shrink-0 max-w-full lg:max-w-[250px]">
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

export default KernBox;
