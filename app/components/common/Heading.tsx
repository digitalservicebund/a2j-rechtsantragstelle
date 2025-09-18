import classNames from "classnames";
import type { AriaRole, ReactNode } from "react";

export const allowedHeadingTags = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "div",
] as const;

export const allowedHeadingLooks = [
  "default",
  "ds-heading-01-reg",
  "ds-heading-02-reg",
  "ds-heading-03-reg",
  "ds-heading-03-bold",
  "ds-subhead",
  "ds-label-01-reg",
  "ds-label-01-bold",
  "ds-label-02-reg",
  "ds-label-02-bold",
  "ds-label-03-reg",
  "ds-label-03-bold",
  "ds-label-section",
  "ds-body-01-reg",
  "ds-body-02-reg",
] as const;

export type HeadingProps = Readonly<{
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  look?: (typeof allowedHeadingLooks)[number];
  className?: string;
  children?: ReactNode;
  dataTestid?: string; // To be removed?
  role?: AriaRole; // To be removed?
  tabIndex?: number;
  innerRef?: React.Ref<HTMLHeadingElement>; // to be removed?
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
  if ((!text || text?.trim() === "") && !children) return null;
  const Tag = tagName;
  return (
    <Tag
      ref={innerRef}
      tabIndex={tabIndex}
      role={role}
      data-testid={dataTestid}
      className={classNames(look === "default" ? null : look, className)}
      id={elementId}
    >
      {children ?? text}
    </Tag>
  );
}

export default Heading;
