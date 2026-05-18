import type { allowedHeadingTags } from "./types";

export type HeadlineProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  tabIndex?: number;
  elementId?: string;
};

const Headline = ({
  tagName = "h1",
  text,
  tabIndex,
  elementId,
}: HeadlineProps) => {
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

export default Headline;
