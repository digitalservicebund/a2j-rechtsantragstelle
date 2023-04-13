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

function Heading({ level, text, className, style, ...props }: HeadingProps) {
  const headingProps = {
    ...props,
    className: `${className || ""} ${style || ""}`.trim(),
  };
  return React.createElement(
    elements[level - 1] || elements[0],
    { ...headingProps },
    text
  );
}

Heading.defaultProps = {
  level: 1,
};

export default Heading;
