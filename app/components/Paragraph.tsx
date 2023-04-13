import React from "react";
import RichText from "~/components/RichText";

export interface ParagraphProps extends React.ClassAttributes<typeof RichText> {
  text: string;
  className?: string;
}

function Paragraph({ text, ...props }: ParagraphProps) {
  return <RichText markdown={text} {...props} />;
}

export default Paragraph;
