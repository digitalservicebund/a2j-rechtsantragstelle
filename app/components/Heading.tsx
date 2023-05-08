import classNames from "classnames";
import type { ReactNode } from "react";
import React from "react";

// legacy
const elements = ["h1", "h2", "h3", "h4", "h5", "h6"];

export interface HeadingProps {
  level?: number; // legacy
  tagName?: string;
  text?: string;
  className?: string;
  style?: string; // legacy
  look?: string;
  children?: ReactNode;
}

function Heading({
  level,
  tagName = "h1",
  text,
  className,
  style,
  look,
  children,
}: HeadingProps) {
  // legacy
  const headingProps = {
    className: `${className || ""} ${style || ""}`.trim(),
  };
  if (level) {
    return React.createElement(
      elements[level - 1] || elements[0],
      { ...headingProps },
      text || children
    );
  }

  const Tag = tagName as keyof JSX.IntrinsicElements;
  const cssClasses = classNames(look === "default" ? null : look, className);

  if (children) {
    return <Tag className={cssClasses}>{children}</Tag>;
  }

  return (
    <Tag
      className={cssClasses}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    />
  );
}

// legacy
Heading.defaultProps = {
  level: 1,
};

export default Heading;
