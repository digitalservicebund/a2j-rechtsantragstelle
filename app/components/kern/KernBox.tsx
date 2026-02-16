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
  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      id={identifier}
    >
      <div className="flex flex-col gap-kern-space-small p-kern-space-x-large">
        <div className="flex flex-row items-start gap-kern-space-x-large">
          {image && (
            <div className="shrink-0 max-w-full">
              <Image {...image} />
            </div>
          )}
          <div className="flex flex-col gap-kern-space-x-large">
            <div className="flex flex-col">
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
        </div>
      </div>
    </GridItem>
  );
};

export default KernBox;
