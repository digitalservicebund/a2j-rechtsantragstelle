import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import RichText, { RichTextPropsSchema } from "./RichText";

export const HeaderPropsSchema = z.object({
  heading: HeadingPropsSchema,
  content: RichTextPropsSchema.optional(),
});

type HeaderProps = z.infer<typeof HeaderPropsSchema>;

export default function Header({ heading, content }: HeaderProps) {
  return (
    <div className="ds-stack-16">
      <Heading {...heading} />
      {content && (
        <div className="ds-heading-03-reg">
          <RichText {...content} />
        </div>
      )}
    </div>
  );
}
