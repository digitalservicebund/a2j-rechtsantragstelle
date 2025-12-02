import { allowedHeadingTags } from "./types";

export type KernLabelProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
};

const KernLabel = ({ tagName = "h1", text }: KernLabelProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  return <Tag className="kern-label p-0!">{text}</Tag>;
};

export default KernLabel;
