// components/ContentGrid.tsx
import cx from "classnames";
import type { PropsWithChildren, CSSProperties } from "react";

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

type ContentGridProps = PropsWithChildren<{
  cols?: number;
  mdCols?: number;
  lgCols?: number;
  xlCols?: number;
  background?: BgSpan;
  className?: string;
  style?: CSSProperties;
  id?: string;
}>;

export function ContentGrid({
  children,
  cols = 1,
  mdCols = 8,
  lgCols = 12,
  xlCols = 12,
  background,
  className,
  id,
  style,
}: ContentGridProps) {
  const bgItem =
    background &&
    cx(
      "[grid-row:1] z-0",
      (background.start ?? 1) && `col-start-${background.start ?? 1}`,
      (background.span ?? 12) && `col-span-${background.span ?? 12}`,
      background.mdStart && `md:col-start-${background.mdStart}`,
      background.mdSpan && `md:col-span-${background.mdSpan}`,
      background.lgStart && `lg:col-start-${background.lgStart}`,
      background.lgSpan && `lg:col-span-${background.lgSpan}`,
      background.xlStart && `xl:col-start-${background.xlStart}`,
      background.xlSpan && `xl:col-span-${background.xlSpan}`,
    );

  return (
    <div
      className={cx("grid-fluid", "[&>*]:min-w-0", className)}
      style={{
        ["--cols-md" as any]: mdCols,
        ["--cols-lg" as any]: lgCols,
        ["--cols-xl" as any]: xlCols,
      }}
      id={id}
    >
      {background && (
        <div className={bgItem} aria-hidden>
          <div className={cx("h-full w-full", background.className)} />
        </div>
      )}

      {children}
    </div>
  );
}
