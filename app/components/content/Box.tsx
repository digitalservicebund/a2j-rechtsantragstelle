import Button, { type ButtonProps } from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import RichText, { type RichTextProps } from "~/components/RichText";
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
  );
};

export default Box;
