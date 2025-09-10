import classNames from "classnames";
import type { PropsWithChildren } from "react";
import { getGridClass, type Span } from "./util";

type GridItemProps = PropsWithChildren<{
  span?: number;
  start?: number;
  mdSpan?: number;
  mdStart?: number;
  lgSpan?: number;
  lgStart?: number;
  xlSpan?: number;
  xlStart?: number;
  className?: string;
  id?: string;
}>;

export function GridItem({
  children,
  span = 12,
  start = 1,
  mdSpan,
  mdStart,
  lgSpan,
  lgStart,
  xlSpan,
  xlStart,
  className,
  id,
}: GridItemProps) {
  const cls = classNames(
    getGridClass("col-start", start as Span),
    getGridClass("col-span", span as Span),
    mdSpan && getGridClass("col-span", mdSpan as Span, "md"),
    mdStart && getGridClass("col-start", mdStart as Span, "md"),
    lgSpan && getGridClass("col-span", lgSpan as Span, "lg"),
    lgStart && getGridClass("col-start", lgStart as Span, "lg"),
    xlSpan && getGridClass("col-span", xlSpan as Span, "xl"),
    xlStart && getGridClass("col-start", xlStart as Span, "xl"),
    className,
  );

  return (
    <div className={cls} id={id}>
      {children}
    </div>
  );
}
