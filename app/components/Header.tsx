import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import Paragraph, { ParagraphPropsSchema } from "./Paragraph";

export const HeaderPropsSchema = z.object({
  heading: HeadingPropsSchema,
  content: ParagraphPropsSchema.optional(),
});

export type HeaderProps = z.infer<typeof HeaderPropsSchema>;

export default function Header({ heading, content }: HeaderProps) {
  return (
    <div className="ds-stack-16">
      <Heading {...heading} />
      {content && (
        <div className="ds-heading-03-reg">
          <Paragraph {...content} />
        </div>
      )}
    </div>
  );
}
