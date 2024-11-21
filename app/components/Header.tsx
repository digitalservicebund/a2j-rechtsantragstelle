import { z } from "zod";
import Heading, { type HeadingProps } from "./Heading";
import RichText, { RichTextPropsSchema } from "./RichText";

export const HeaderPropsSchema = z
  .object({
    heading: z.custom<HeadingProps>(),
    content: RichTextPropsSchema.optional(),
  })
  .readonly();

type HeaderProps = z.infer<typeof HeaderPropsSchema>;

export default function Header({ heading, content }: HeaderProps) {
  return (
    <div className="ds-stack-16">
      <Heading {...heading} />
      {content && (
        <RichText className="ds-heading-03-reg" markdown={content.markdown} />
      )}
    </div>
  );
}
