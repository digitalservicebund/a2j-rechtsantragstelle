import type { ReactNode } from "react";
import React from "react";

const elements = ["h1", "h2", "h3", "h4", "h5", "h6"];

export interface HeadingProps
  extends React.ClassAttributes<HTMLHeadingElement> {
  level: number;
  text: ReactNode;
  className?: string;
  style?: string;
}

function Heading({ level, text, style, ...props }: HeadingProps) {
  // QUICKFIX: ignore style prop, to fix: Error: The `style` prop expects a mapping from style properties to values, not a string.
  return React.createElement(
    elements[level - 1] || elements[0],
    { ...props },
    text
  );
}

Heading.defaultProps = {
  level: 1,
};

export default Heading;
