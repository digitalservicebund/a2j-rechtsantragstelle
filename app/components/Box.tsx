import type { HeadingProps } from "./Heading";
import type { ButtonProps } from "./Button";
import Heading from "./Heading";
import RichText from "./RichText";
import Button from "./Button";
import type { ParagraphProps } from "./Paragraph";

export interface BoxProps {
  label?: HeadingProps;
  heading?: HeadingProps;
  content?: ParagraphProps;
  button?: ButtonProps;
}

const Box = ({ label, heading, content, button }: BoxProps) => {
  return (
    <div className="ds-stack-16">
      <div className="ds-stack-8">
        {label && <Heading {...label} />}
        {heading && <Heading {...heading} />}
        {content && (
          <div>
            <RichText markdown={content.text} />
          </div>
        )}
      </div>
      {button && (
        <div>
          <Button {...button} />
        </div>
      )}
    </div>
  );
};

export default Box;
