import type { ReactNode } from "react";
import React from "react";

const elements = ["h1", "h2", "h3", "h4", "h5", "h6"];

type HeadingProps = {
  size: number;
  text: ReactNode;
};

function Heading({ size, text }: HeadingProps) {
  return React.createElement(elements[size - 1] || elements[0], {}, text);
}

Heading.defaultProps = {
  size: 1,
};

export default Heading;
