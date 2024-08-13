import classNames from "classnames";
import { decode } from "html-entities";
import { AriaRole, type ReactNode } from "react";

export type HeadingProps = Readonly<{
  tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  text?: string;
  look?: string;
  className?: string;
  children?: ReactNode;
  dataTestid?: string;
  role?: AriaRole;
  tagId?: string;
}>;

function Heading({
  tagName = "h1",
  text,
  className,
  look,
  children,
  dataTestid,
  role,
  tagId,
}: HeadingProps) {
  const Tag: keyof JSX.IntrinsicElements = tagName;
  const cssClasses = classNames(look === "default" ? null : look, className);

  if ((typeof text === "undefined" || text?.trim() === "") && !children) {
    return null;
  }

  return (
    <Tag id={tagId} role={role} data-testid={dataTestid} className={cssClasses}>
      {children ?? decode(text)}
    </Tag>
  );
}

export default Heading;
