import classNames from "classnames";
import type { AriaRole, LegacyRef, ReactNode } from "react";

export type HeadingProps = Readonly<{
  tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  text?: string;
  look?: string;
  className?: string;
  children?: ReactNode;
  dataTestid?: string;
  role?: AriaRole;
  tabIndex?: number;
  innerRef?: LegacyRef<HTMLHeadingElement>;
  elementId?: string;
}>;

function Heading({
  tagName = "h1",
  text,
  className,
  look,
  children,
  dataTestid,
  role,
  tabIndex,
  innerRef,
  elementId,
}: HeadingProps) {
  const Tag: keyof JSX.IntrinsicElements = tagName;
  const cssClasses = classNames(look === "default" ? null : look, className);

  if ((typeof text === "undefined" || text?.trim() === "") && !children) {
    return null;
  }

  return (
    <Tag
      ref={innerRef}
      tabIndex={tabIndex}
      role={role}
      data-testid={dataTestid}
      className={cssClasses}
      id={elementId}
    >
      {children ?? text}
    </Tag>
  );
}

export default Heading;
