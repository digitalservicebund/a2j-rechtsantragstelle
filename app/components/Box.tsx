import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import RichText from "./RichText";
import { ParagraphPropsSchema } from "./Paragraph";
import Button, { ButtonPropsSchema } from "./Button";
import ButtonContainer from "./ButtonContainer";

export const BoxPropsSchema = z.object({
  identifier: z.string().optional(),
  label: HeadingPropsSchema.optional(),
  heading: HeadingPropsSchema.optional(),
  content: ParagraphPropsSchema.optional(),
  button: ButtonPropsSchema.optional(),
  buttons: z.array(ButtonPropsSchema).optional(),
});

export type BoxProps = z.infer<typeof BoxPropsSchema>;

const Box = ({
  identifier,
  label,
  heading,
  content,
  button,
  buttons,
}: BoxProps) => {
  return (
    <div className="ds-stack-16 scroll-my-40" id={identifier}>
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
      {buttons && buttons.length > 0 && (
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
