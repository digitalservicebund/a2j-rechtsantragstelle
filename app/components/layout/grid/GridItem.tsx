import classNames from "classnames";
import type { PropsWithChildren } from "react";
import { getGridClass } from "./util";
import type { Column, Span } from "./types";

type GridItemProps = PropsWithChildren<{
  smColumn?: Column;
  mdColumn?: Column;
  lgColumn?: Column;
  xlColumn?: Column;
  className?: string;
  id?: string;
}>;

export function GridItem({
  children,
  smColumn = { start: 1, span: 12 },
  mdColumn,
  lgColumn,
  xlColumn,
  className,
  id,
}: GridItemProps) {
  const cls = classNames(
    getGridClass("col-start", smColumn.start as Span),
    getGridClass("col-span", smColumn.span as Span),
    mdColumn && getGridClass("col-span", mdColumn.span as Span, "md"),
    mdColumn && getGridClass("col-start", mdColumn.start as Span, "md"),
    lgColumn && getGridClass("col-span", lgColumn.span as Span, "lg"),
    lgColumn && getGridClass("col-start", lgColumn.start as Span, "lg"),
    xlColumn && getGridClass("col-span", xlColumn.span as Span, "xl"),
    xlColumn && getGridClass("col-start", xlColumn.start as Span, "xl"),
    "[grid-row:1] z-10",
    className,
  );

  return (
    <div className={cls} id={id}>
      {children}
    </div>
  );
}
