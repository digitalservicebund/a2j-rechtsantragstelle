import { allowedHeadingTags } from "./types";

export type KernLabelProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  tabIndex?: number;
  id?: string;
};

const KernLabel = ({ tagName = "h1", text, tabIndex, id }: KernLabelProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  return (
    <Tag className="kern-label p-0!" tabIndex={tabIndex} id={id}>
      {text}
    </Tag>
  );
};

export default KernLabel;
