import Heading, { HeadingPropsSchema } from "./Heading";
import RichText from "./RichText";
import { ParagraphPropsSchema } from "./Paragraph";
import Button, { ButtonPropsSchema } from "./Button";
import { z } from "zod";

export const BoxPropsSchema = z.object({
  label: HeadingPropsSchema.optional(),
  heading: HeadingPropsSchema.optional(),
  content: ParagraphPropsSchema.optional(),
  button: ButtonPropsSchema.optional(),
});

export type BoxProps = z.infer<typeof BoxPropsSchema>;

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
