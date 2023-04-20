import type { HeadingProps } from "./Heading";
import type { ButtonProps } from "./Button";
import Heading from "./Heading";
import RichText from "./RichText";
import Button from "./Button";
import type { ParagraphProps } from "./Paragraph";

export interface BoxProps {
  heading?: HeadingProps;
  label?: string;
  content?: ParagraphProps;
  button?: ButtonProps;
}

const Box = ({ heading, label, content, button }: BoxProps) => {
  return (
    <div className="ds-stack stack-8">
      {label ? <div className="ds-label-02-bold">{label}</div> : ""}
      {heading ? <Heading {...heading} /> : ""}
      {content ? (
        <div>
          <RichText markdown={content.text} />
        </div>
      ) : (
        ""
      )}
      {button ? (
        <div>
          <Button {...button} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Box;
