import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import RichText, { RichTextPropsSchema } from "./RichText";

export const HeaderPropsSchema = z
  .object({
    heading: HeadingPropsSchema,
    content: RichTextPropsSchema.optional(),
  })
  .readonly();

type HeaderProps = z.infer<typeof HeaderPropsSchema>;

export default function Header({ heading, content }: HeaderProps) {
  return (
    <div className="ds-stack-16">
      <Heading {...heading} />
      {content && (
        <RichText
          className={`ds-heading-03-reg ${content.className ?? ""}`}
          markdown={content.markdown}
        />
      )}
    </div>
  );
}
