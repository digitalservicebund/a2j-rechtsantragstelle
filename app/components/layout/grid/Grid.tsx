import classNames from "classnames";
import type { PropsWithChildren, CSSProperties } from "react";
import { getGridClass } from "./util";
import type { Background, Span } from "./types";

type GridProps = PropsWithChildren<{
  background?: Background;
  className?: string;
  style?: CSSProperties;
  id?: string;
}>;

export function Grid({ children, background, className, id }: GridProps) {
  const bgItem =
    background &&
    classNames(
      "[grid-row:1] z-0",
      (background.smColumn?.start ?? 1) &&
        getGridClass("col-start", (background.smColumn?.start as Span) ?? 1),
      (background.smColumn?.span ?? 12) &&
        getGridClass("col-span", (background.smColumn?.span as Span) ?? 12),
      background.mdColumn?.start &&
        getGridClass("col-start", background.mdColumn?.start as Span, "md"),
      background.mdColumn?.span &&
        getGridClass("col-span", background.mdColumn?.span as Span, "md"),
      background.lgColumn?.start &&
        getGridClass("col-start", background.lgColumn?.start as Span, "lg"),
      background.lgColumn?.span &&
        getGridClass("col-span", background.lgColumn?.span as Span, "lg"),
      background.xlColumn?.start &&
        getGridClass("col-start", background.xlColumn?.start as Span, "xl"),
      background.xlColumn?.span &&
        getGridClass("col-span", background.xlColumn?.span as Span, "xl"),
    );

  const baseClasses = classNames(
    "grid-fluid",
    "[&>*]:min-w-0",
    "gap-y-24",
    className,
  );

  return (
    <div className={baseClasses} id={id}>
      {background && (
        <div className={bgItem} aria-hidden>
          <div className={classNames("h-full w-full", background?.className)} />
        </div>
      )}

      {children}
    </div>
  );
}
