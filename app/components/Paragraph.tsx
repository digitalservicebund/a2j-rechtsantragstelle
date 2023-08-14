import React from "react";
import { z } from "zod";
import RichText from "~/components/RichText";

export const ParagraphPropsSchema = z.object({
  text: z.string(),
  className: z.string().optional(),
});

type ParagraphProps = z.infer<typeof ParagraphPropsSchema> &
  React.ClassAttributes<typeof RichText>;

function Paragraph({ text, ...props }: ParagraphProps) {
  return <RichText markdown={text} {...props} />;
}

export default Paragraph;
