import { GridItem } from "../layout/grid/GridItem";
import type { allowedHeadingTags } from "./types";

const SIZES_MAP_HEADING = {
  medium: "kern-heading-medium",
  large: "kern-heading-large",
  xLarge: "kern-heading-x-large",
};

const SIZES_MAP_LABEL = {
  small: "kern-label kern-label--small",
  large: "kern-label kern-label--large",
};

export const SIZES = Object.keys(SIZES_MAP_HEADING) as Array<
  keyof typeof SIZES_MAP_HEADING
>;

export type HeadingProps = {
  tagName?: (typeof allowedHeadingTags)[number];
  text?: string;
  tabIndex?: number;
  className?: string;
  elementId?: string;
  size?: keyof typeof SIZES_MAP_HEADING | keyof typeof SIZES_MAP_LABEL;
  managedByParent?: boolean;
  type?: "heading" | "label";
};

const Heading = ({
  tagName = "h1",
  text,
  tabIndex,
  managedByParent = false,
  className,
  elementId,
  size,
  type = "heading",
}: HeadingProps) => {
  if (!text || text?.trim() === "") return null;
  const Tag = tagName;

  const sizeClass =
    type === "label"
      ? (SIZES_MAP_LABEL[(size as keyof typeof SIZES_MAP_LABEL) ?? "large"] ??
        SIZES_MAP_LABEL["large"])
      : (SIZES_MAP_HEADING[
          (size as keyof typeof SIZES_MAP_HEADING) ?? "large"
        ] ?? SIZES_MAP_HEADING["large"]);

  if (!managedByParent) {
    return (
      <GridItem
        mdColumn={{ start: 1, span: 8 }}
        lgColumn={{ start: 3, span: 8 }}
        xlColumn={{ start: 3, span: 8 }}
        className="px-kern-space-large lg:px-0 xl:px-0"
      >
        <Tag
          className={`${sizeClass} p-0! ${className ?? ""} outline-none`}
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
      className={`${sizeClass} p-0! ${className ?? ""} hyphens-auto outline-none`}
      tabIndex={tabIndex}
      id={elementId}
    >
      {text}
    </Tag>
  );
};

export default Heading;
