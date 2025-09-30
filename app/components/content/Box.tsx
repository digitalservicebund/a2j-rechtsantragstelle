import Button, { type ButtonProps } from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import RichText, { type RichTextProps } from "~/components/common/RichText";
import { GridItem } from "~/components/layout/grid/GridItem";
import { arrayIsNonEmpty } from "~/util/array";

type BoxProps = {
  identifier?: string;
  label?: HeadingProps;
  heading?: HeadingProps;
  content?: RichTextProps;
  buttons?: ButtonProps[];
};

const Box = ({ identifier, label, heading, content, buttons }: BoxProps) => {
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
