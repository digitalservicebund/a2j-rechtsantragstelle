import type { allowedHeadingTags } from "./types";

export type KernHeadlineProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  tabIndex?: number;
  elementId?: string;
};

const KernHeadline = ({
  tagName = "h1",
  text,
  tabIndex,
  elementId,
}: KernHeadlineProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  return (
    <Tag
      className="kern-heading-medium p-0!"
      tabIndex={tabIndex}
      id={elementId}
    >
      {text}
    </Tag>
  );
};

export default KernHeadline;
