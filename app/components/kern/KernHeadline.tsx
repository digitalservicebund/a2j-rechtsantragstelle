import type { allowedHeadingTags } from "./types";

export type KernHeadlineProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  tabIndex?: number;
  id?: string;
};

const KernHeadline = ({
  tagName = "h1",
  text,
  tabIndex,
  id,
}: KernHeadlineProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  return (
    <Tag className="kern-heading-medium p-0!" tabIndex={tabIndex} id={id}>
      {text}
    </Tag>
  );
};

export default KernHeadline;
