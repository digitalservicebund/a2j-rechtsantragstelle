import { GridItem } from "../layout/grid/GridItem";
import type { allowedHeadingTags } from "./types";

export type KernHeadingProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  tabIndex?: number;
  className?: string;
  elementId?: string;
  managedByParent?: boolean;
};

const KernHeading = ({
  tagName = "h1",
  text,
  tabIndex,
  className,
  elementId,
  managedByParent = false,
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
      className={`kern-heading-large p-0! ${className ?? ""}`}
      tabIndex={tabIndex}
      id={elementId}
    >
      {text}
    </Tag>
  );
};

export default KernHeading;
