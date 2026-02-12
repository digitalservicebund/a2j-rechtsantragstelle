import { GridItem } from "../layout/grid/GridItem";
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
  managedByParent?: boolean;
};

const KernHeading = ({
  tagName = "h1",
  text,
  tabIndex,
  managedByParent = false,
  className,
  elementId,
  size = "xLarge",
}: KernHeadingProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  if (!managedByParent) {
    return (
      <GridItem
        mdColumn={{ start: 1, span: 8 }}
        lgColumn={{ start: 3, span: 8 }}
        xlColumn={{ start: 3, span: 8 }}
      >
        <Tag
          className={`kern-heading-large p-0! ${className ?? ""}`}
          tabIndex={tabIndex}
          id={elementId}
        >
          {text}
        </Tag>
      </GridItem>
    );
  }
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
