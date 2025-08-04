import { arrayIsNonEmpty } from "~/util/array";
import Button, { type ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";
import GridContainer, { GridItem } from "./GridContainer";

type BoxProps = {
  identifier?: string;
  label?: HeadingProps;
  heading?: HeadingProps;
  content?: RichTextProps;
  buttons?: ButtonProps[];
};

const Box = ({ identifier, label, heading, content, buttons }: BoxProps) => {
  return (
    <GridContainer
      columns={12}
      maxWidth="xl"
      alignItems="start"
      paddingX="sm"
      justifyContent="start"
    >
      <GridItem
        span={12}
        colStart={1}
        className="bg-blue-100 px-32 py-32 rounded-lg"
      >
        <div className="ds-stack ds-stack-16 scroll-my-40" id={identifier}>
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
    </GridContainer>
  );
};

export default Box;
