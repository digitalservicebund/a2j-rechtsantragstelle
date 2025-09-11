import classNames from "classnames";
import type { PropsWithChildren, CSSProperties } from "react";
import { getGridClass, type Span } from "./util";

type BgSpan = {
  start?: number;
  span?: number;
  mdStart?: number;
  mdSpan?: number;
  lgStart?: number;
  lgSpan?: number;
  xlStart?: number;
  xlSpan?: number;
  className?: string;
};

type GridProps = PropsWithChildren<{
  cols?: number;
  mdCols?: number;
  lgCols?: number;
  xlCols?: number;
  background?: BgSpan;
  className?: string;
  style?: CSSProperties;
  id?: string;
}>;

export function Grid({
  children,
  mdCols = 8,
  lgCols = 12,
  xlCols = 12,
  background,
  className,
  id,
}: GridProps) {
  const bgItem =
    background &&
    classNames(
      "[grid-row:1] z-0",
      (background.start ?? 1) &&
        getGridClass("col-start", (background.start as Span) ?? 1),
      (background.span ?? 12) &&
        getGridClass("col-span", (background.span as Span) ?? 12),
      background.mdStart &&
        getGridClass("col-start", background.mdStart as Span, "md"),
      background.mdSpan &&
        getGridClass("col-span", background.mdSpan as Span, "md"),
      background.lgStart &&
        getGridClass("col-start", background.lgStart as Span, "lg"),
      background.lgSpan &&
        getGridClass("col-span", background.lgSpan as Span, "lg"),
      background.xlStart &&
        getGridClass("col-start", background.xlStart as Span, "xl"),
      background.xlSpan &&
        getGridClass("col-span", background.xlSpan as Span, "xl"),
    );

  const baseClasses = classNames(
    "grid-fluid",
    "[&>*]:min-w-0",
    "gap-y-24",
    className,
  );

  return (
    <div
      className={baseClasses}
      style={{
        ["--cols-md" as string]: mdCols,
        ["--cols-lg" as string]: lgCols,
        ["--cols-xl" as string]: xlCols,
      }}
      id={id}
    >
      {background && (
        <div className={bgItem} aria-hidden>
          <div className={classNames("h-full w-full", background?.className)} />
        </div>
      )}

      {children}
    </div>
  );
}
