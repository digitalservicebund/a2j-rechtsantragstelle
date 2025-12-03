import type { allowedHeadingTags } from "./types";

export type KernHeadingProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  tabIndex?: number;
  id?: string;
};

const KernHeading = ({
  tagName = "h1",
  text,
  tabIndex,
  id,
}: KernHeadingProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  return (
    <Tag className="kern-heading-x-large p-0!" tabIndex={tabIndex} id={id}>
      {text}
    </Tag>
  );
};

export default KernHeading;
