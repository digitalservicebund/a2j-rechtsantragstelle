import type { allowedHeadingTags } from "./types";

export type KernHeadingProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  tabIndex?: number;
  elementId?: string;
  className?: string;
};

const KernHeading = ({
  tagName = "h1",
  text,
  tabIndex,
  elementId,
  className,
}: KernHeadingProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  return (
    <Tag
      className={`kern-heading-x-large p-0! ${className ?? ""}`}
      tabIndex={tabIndex}
      id={elementId}
    >
      {text}
    </Tag>
  );
};

export default KernHeading;
