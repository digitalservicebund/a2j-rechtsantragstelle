import React from "react";
import { z } from "zod";
import RichText from "~/components/RichText";

export const ParagraphPropsSchema = z.object({
  text: z.string(),
  className: z.string().optional(),
});

export interface ParagraphProps extends React.ClassAttributes<typeof RichText> {
  text: string;
  className?: string;
}

function Paragraph({ text, ...props }: ParagraphProps) {
  return <RichText markdown={text} {...props} />;
}

export default Paragraph;
