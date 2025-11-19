import classNames from "classnames";
import type { ReactNode } from "react";

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
  tabIndex?: number;
  innerRef?: React.Ref<HTMLHeadingElement>;
  elementId?: string;
}>;

function KernHeading({
  tagName = "h1",
  text,
  className,
  look,
  children,
  tabIndex,
  innerRef,
  elementId,
}: HeadingProps) {
  if ((!text || text?.trim() === "") && !children) return null;
  const Tag = tagName;

  // Map existing look classes to KERN equivalents
  const kernLookMapping: Record<string, string> = {
    "ds-heading-01-reg": "kern-heading kern-heading--h1",
    "ds-heading-02-reg": "kern-heading kern-heading--h2",
    "ds-heading-03-reg": "kern-heading kern-heading--h3",
    "ds-heading-03-bold": "kern-heading kern-heading--h3-bold",
    "ds-subhead": "kern-heading kern-heading--subhead",
    "ds-label-01-reg": "kern-heading kern-heading--label",
    "ds-label-01-bold": "kern-heading kern-heading--label-bold",
    "ds-label-02-reg": "kern-heading kern-heading--label-sm",
    "ds-label-02-bold": "kern-heading kern-heading--label-sm-bold",
    "ds-label-03-reg": "kern-heading kern-heading--label-xs",
    "ds-label-03-bold": "kern-heading kern-heading--label-xs-bold",
    "ds-label-section": "kern-heading kern-heading--section",
    "ds-body-01-reg": "kern-text kern-text--body",
    "ds-body-02-reg": "kern-text kern-text--body-sm",
  };

  const kernLook = look && look !== "default" ? kernLookMapping[look] || "kern-heading" : "kern-heading";

  return (
    <Tag
      ref={innerRef}
      tabIndex={tabIndex}
      className={classNames(look === "default" ? "kern-heading" : kernLook, className)}
      id={elementId}
    >
      {children ?? text}
    </Tag>
  );
}

export default KernHeading;