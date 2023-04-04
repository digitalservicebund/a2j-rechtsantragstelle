import React from "react";
import RichText from "~/components/RichText";

export interface ParagraphProps extends React.ClassAttributes<typeof RichText> {
  text: string;
}

function Paragraph({ text, key }: ParagraphProps) {
  return <RichText markdown={text} key={key} />;
}

export default Paragraph;
