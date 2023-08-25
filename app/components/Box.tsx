import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import RichText, { RichTextPropsSchema } from "./RichText";
import Button, { ButtonPropsSchema } from "./Button";
import ButtonContainer from "./ButtonContainer";

export const BoxPropsSchema = z.object({
  identifier: z.string().optional(),
  label: HeadingPropsSchema.optional(),
  heading: HeadingPropsSchema.optional(),
  content: RichTextPropsSchema.optional(),
  buttons: z.array(ButtonPropsSchema).optional(),
});

type BoxProps = z.infer<typeof BoxPropsSchema>;

const Box = ({ identifier, label, heading, content, buttons }: BoxProps) => {
  return (
    <div className="ds-stack-16 scroll-my-40" id={identifier}>
      <div className="ds-stack-8">
        {label && <Heading {...label} />}
        {heading && <Heading {...heading} />}
        {content && (
          <div>
            <RichText {...content} />
          </div>
        )}
      </div>
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
