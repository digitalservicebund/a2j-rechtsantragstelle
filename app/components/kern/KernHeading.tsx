import type { allowedHeadingTags } from "./types";

const SIZES = {
  medium: "kern-heading-medium",
  large: "kern-heading-large",
  xLarge: "kern-heading-x-large",
};

export type KernHeadingProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  tabIndex?: number;
  className?: string;
  elementId?: string;
  size?: keyof typeof SIZES;
};

const KernHeading = ({
  tagName = "h1",
  text,
  tabIndex,
  className,
  elementId,
  size = "xLarge",
}: KernHeadingProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  return (
    <Tag
      className={`${SIZES[size as keyof typeof SIZES]} p-0! ${className ?? ""}`}
      tabIndex={tabIndex}
      id={elementId}
    >
      {text}
    </Tag>
  );
};

export default KernHeading;
