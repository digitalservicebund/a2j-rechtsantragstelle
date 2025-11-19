import KernButton, { type ButtonProps } from "~/components/kern/KernButton";
import ButtonContainer from "~/components/common/ButtonContainer";
import KernHeading, { type HeadingProps } from "~/components/kern/KernHeading";
import KernRichText, { type RichTextProps } from "~/components/kern/KernRichText";
import { GridItem } from "~/components/layout/grid/GridItem";
import { arrayIsNonEmpty } from "~/util/array";

type BoxProps = {
  identifier?: string;
  label?: HeadingProps;
  heading?: HeadingProps;
  content?: RichTextProps;
  buttons?: ButtonProps[];
};

const KernBox = ({ identifier, label, heading, content, buttons }: BoxProps) => {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="py-24 px-16 md:px-16 lg:px-0 xl:px-0"
      id={identifier}
    >
      <div className="kern-stack-lg scroll-my-40">
        <div className="kern-stack-sm">
          {label && <KernHeading {...label} />}
          {heading && <KernHeading {...heading} />}
          {content && (
            <div className="kern-text-container">
              <KernRichText {...content} />
            </div>
          )}
        </div>
        {arrayIsNonEmpty(buttons) && (
          <ButtonContainer className="kern-button-group">
            {buttons.map((button) => (
              <KernButton key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
      </div>
    </GridItem>
  );
};

export default KernBox;