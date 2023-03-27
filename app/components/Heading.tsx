import type { ReactNode } from "react";
import React from "react";

const elements = ["h1", "h2", "h3", "h4", "h5", "h6"];

interface HeadingProps extends React.ClassAttributes<HTMLHeadingElement> {
  level: number;
  text: ReactNode;
}

function Heading({ level, text, ...props }: HeadingProps) {
  return React.createElement(elements[level - 1] || elements[0], props, text);
}

Heading.defaultProps = {
  level: 1,
};

export default Heading;
