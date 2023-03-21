import React from "react";
import RichText from "~/components/RichText";

type ParagraphProps = {
  text: string;
};

function Paragraph({ text }: ParagraphProps) {
  return <RichText markdown={text} />;
}

export default Paragraph;
