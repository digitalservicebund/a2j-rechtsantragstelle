import { z } from "zod";
import { arrayIsNonEmpty } from "~/util/array";
import Button, { ButtonPropsSchema } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import RichText, { RichTextPropsSchema } from "./RichText";

export const BoxPropsSchema = z.object({
  identifier: z.string().optional(),
  label: z.custom<HeadingProps>().optional(),
  heading: z.custom<HeadingProps>().optional(),
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
