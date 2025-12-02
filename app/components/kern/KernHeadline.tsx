import { ReactNode } from "react";
import { allowedHeadingTags } from "./types";

export type KernHeadlineProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
};

const KernHeadline = ({ tagName = "h1", text }: KernHeadlineProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  return <Tag className="kern-heading-medium p-0!">{text}</Tag>;
};

export default KernHeadline;
