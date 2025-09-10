import classNames from "classnames";
import type { PropsWithChildren } from "react";
import { getGridClass } from "./util";

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
    getGridClass("col-start", start),
    getGridClass("col-span", span),
    mdSpan && getGridClass("col-span", mdSpan, "md"),
    mdStart && getGridClass("col-start", mdStart, "md"),
    lgSpan && getGridClass("col-span", lgSpan, "lg"),
    lgStart && getGridClass("col-start", lgStart, "lg"),
    xlSpan && getGridClass("col-span", xlSpan, "xl"),
    xlStart && getGridClass("col-start", xlStart, "xl"),
    className,
  );

  return (
    <div className={cls} id={id}>
      {children}
    </div>
  );
}
