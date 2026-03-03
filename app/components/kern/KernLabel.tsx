import classNames from "classnames";
import type { allowedHeadingTags } from "./types";

export type KernLabelProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  tabIndex?: number;
  elementId?: string;
  className?: string;
};

const KernLabel = ({
  tagName = "h1",
  text,
  tabIndex,
  elementId,
  className,
}: KernLabelProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  return (
    <Tag
      className={classNames("kern-label p-0!", className)}
      tabIndex={tabIndex}
      id={elementId}
    >
      {text}
    </Tag>
  );
};

export default KernLabel;
