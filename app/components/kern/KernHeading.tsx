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
    "ds-heading-01-reg": "kern-heading-x-large",
    "ds-heading-02-reg": "kern-heading-large",
    "ds-heading-03-reg": "kern-heading-medium",
    "ds-heading-03-bold": "kern-heading-medium kern-body--bold",
    "ds-subhead": "kern-heading-small",
    "ds-label-01-reg": "kern-label kern-label--large",
    "ds-label-01-bold": "kern-label kern-label--large kern-body--bold",
    "ds-label-02-reg": "kern-label",
    "ds-label-02-bold": "kern-label kern-body--bold",
    "ds-label-03-reg": "kern-label kern-label--small",
    "ds-label-03-bold": "kern-label kern-label--small kern-body--bold",
    "ds-label-section": "kern-label",
    "ds-body-01-reg": "kern-body",
    "ds-body-02-reg": "kern-body kern-body--small",
  };

  const kernLook =
    look && look !== "default"
      ? kernLookMapping[look] || "kern-heading-medium"
      : "kern-heading-medium";

  return (
    <Tag
      ref={innerRef}
      tabIndex={tabIndex}
      className={classNames(
        look === "default" ? "kern-heading-medium" : kernLook,
        className,
      )}
      id={elementId}
    >
      {children ?? text}
    </Tag>
  );
}

export default KernHeading;
