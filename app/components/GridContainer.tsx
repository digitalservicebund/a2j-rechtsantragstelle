import classNames from "classnames";
import type { PropsWithChildren } from "react";

export type GridContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "xxl" | "full";
export type GridContainerPadding = "none" | "sm" | "md" | "lg" | "xl" | "xxl";
export type GridContainerColumns =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;
export type GridContainerAlignment = "start" | "center" | "end";
export type GridContainerJustify = "start" | "end" | "center" | "between";

export type GridColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridColumnBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type GridColumnWidth = string; // e.g., "1fr", "200px", "minmax(200px, 1fr)"

export interface GridContainerProps extends PropsWithChildren {
  maxWidth?: GridContainerMaxWidth;
  paddingX?: GridContainerPadding;
  paddingY?: GridContainerPadding;
  columns?: GridContainerColumns;
  className?: string;
  fluid?: boolean; // For full-width container
  alignItems?: GridContainerAlignment;
  justifyContent?: GridContainerJustify;
  columnWidths?: GridColumnWidth[]; // Array of column widths
  style?: React.CSSProperties;
}

export interface GridItemProps extends PropsWithChildren {
  span?: GridColumnSpan;
  spanXs?: GridColumnSpan;
  spanSm?: GridColumnSpan;
  spanMd?: GridColumnSpan;
  spanLg?: GridColumnSpan;
  spanXl?: GridColumnSpan;
  spanXxl?: GridColumnSpan;
  colStart?: GridColumnSpan;
  colStartXs?: GridColumnSpan;
  colStartSm?: GridColumnSpan;
  colStartMd?: GridColumnSpan;
  colStartLg?: GridColumnSpan;
  colStartXl?: GridColumnSpan;
  colStartXxl?: GridColumnSpan;
  className?: string;
}

const MAX_WIDTH_CLASSES: Record<GridContainerMaxWidth, string> = {
  sm: "w-[600px]",
  md: "w-[800px]",
  lg: "w-[1000px]",
  xl: "max-w-[1200px]",
  xxl: "w-[1600px]",
  full: "w-full",
};

const PADDING_X_CLASSES: Record<GridContainerPadding, string> = {
  none: "px-0",
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
  xl: "px-16",
  xxl: "px-32",
};

const PADDING_Y_CLASSES: Record<GridContainerPadding, string> = {
  none: "py-0",
  sm: "py-4",
  md: "py-6",
  lg: "py-8",
  xl: "py-16",
  xxl: "py-32",
};

const GRID_COLUMN_CLASSES: Record<GridContainerColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2 md:grid-cols-2 lg:grid-cols-2",
  3: "grid-cols-3 md:grid-cols-3 lg:grid-cols-3",
  4: "grid-cols-4 md:grid-cols-4 lg:grid-cols-4",
  5: "grid-cols-5 md:grid-cols-5 lg:grid-cols-5",
  6: "grid-cols-6 md:grid-cols-6 lg:grid-cols-6",
  7: "grid-cols-7 md:grid-cols-7 lg:grid-cols-7",
  8: "grid-cols-8 md:grid-cols-8 lg:grid-cols-8",
  9: "grid-cols-9 md:grid-cols-9 lg:grid-cols-9",
  10: "grid-cols-10 md:grid-cols-10 lg:grid-cols-10",
  11: "grid-cols-11 md:grid-cols-11 lg:grid-cols-11",
  12: "grid-cols-12 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-12 lg:grid-cols-12",
};

const ALIGNMENT_CLASSES: Record<GridContainerAlignment, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

const JUSTIFY_CLASSES: Record<GridContainerJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

const getColumnSpanClasses = (props: GridItemProps): string => {
  const classes: string[] = [];

  if (props.span) {
    classes.push(`col-span-${props.span}`);
  }

  if (props.spanXs) {
    classes.push(`xs:col-span-${props.spanXs}`);
  }
  if (props.spanSm) {
    classes.push(`sm:col-span-${props.spanSm}`);
  }
  if (props.spanMd) {
    classes.push(`md:col-span-${props.spanMd}`);
  }
  if (props.spanLg) {
    classes.push(`lg:col-span-${props.spanLg}`);
  }
  if (props.spanXl) {
    classes.push(`xl:col-span-${props.spanXl}`);
  }
  if (props.spanXxl) {
    classes.push(`2xl:col-span-${props.spanXxl}`);
  }

  // Column start classes
  if (props.colStart) {
    classes.push(`col-start-${props.colStart}`);
  }
  if (props.colStartXs) {
    classes.push(`xs:col-start-${props.colStartXs}`);
  }
  if (props.colStartSm) {
    classes.push(`sm:col-start-${props.colStartSm}`);
  }
  if (props.colStartMd) {
    classes.push(`md:col-start-${props.colStartMd}`);
  }
  if (props.colStartLg) {
    classes.push(`lg:col-start-${props.colStartLg}`);
  }
  if (props.colStartXl) {
    classes.push(`xl:col-start-${props.colStartXl}`);
  }
  if (props.colStartXxl) {
    classes.push(`2xl:col-start-${props.colStartXxl}`);
  }

  return classes.join(" ");
};

export function GridItem({
  children,
  span,
  spanXs,
  spanSm,
  spanMd,
  spanLg,
  spanXl,
  spanXxl,
  colStart,
  colStartXs,
  colStartSm,
  colStartMd,
  colStartLg,
  colStartXl,
  colStartXxl,
  className,
}: GridItemProps) {
  const spanClasses = getColumnSpanClasses({
    span,
    spanXs,
    spanSm,
    spanMd,
    spanLg,
    spanXl,
    spanXxl,
    colStart,
    colStartXs,
    colStartSm,
    colStartMd,
    colStartLg,
    colStartXl,
    colStartXxl,
  });

  return <div className={classNames(spanClasses, className)}>{children}</div>;
}

export default function GridContainer({
  children,
  maxWidth = "lg",
  paddingX = "none",
  paddingY = "md",
  columns = 1,
  className,
  fluid = false,
  alignItems = "center",
  justifyContent = "center",
  columnWidths,
  style,
}: GridContainerProps) {
  const containerClasses = classNames(
    // fluid ? "w-full" : "mx-auto w-full",
    // !fluid && MAX_WIDTH_CLASSES[maxWidth],
    PADDING_X_CLASSES[paddingX],
    PADDING_Y_CLASSES[paddingY],
    className,
  );

  const gridTemplateColumnsStyle = columnWidths?.length
    ? { gridTemplateColumns: columnWidths.join(" ") }
    : undefined;

  const gridClasses = classNames(
    "grid gap-32",
    !columnWidths?.length && GRID_COLUMN_CLASSES[columns],
    "justify-self-center",
    "max-w-[1200px]",
    "w-full",
    alignItems && ALIGNMENT_CLASSES[alignItems],
    justifyContent && JUSTIFY_CLASSES[justifyContent],
  );

  if (columns > 1 || columnWidths?.length) {
    return (
      <div className={containerClasses} style={style}>
        <div className={gridClasses} style={gridTemplateColumnsStyle}>
          {children}
        </div>
      </div>
    );
  }

  // Single column layout - just wrap in container
  return <div className={containerClasses}>{children}</div>;
}
