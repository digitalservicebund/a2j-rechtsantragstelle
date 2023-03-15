import type { ReactNode } from "react";
import React from "react";

type ParagraphProps = {
  text: ReactNode;
};

function Paragraph({ text }: ParagraphProps) {
  return React.createElement("p", {}, text);
}

export default Paragraph;
