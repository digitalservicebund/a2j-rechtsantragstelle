import classNames from "classnames";
import type { PropsWithChildren } from "react";

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
    `col-start-${start}`,
    `col-span-${span}`,
    mdSpan && `md:col-span-${mdSpan}`,
    mdStart && `md:col-start-${mdStart}`,
    lgSpan && `lg:col-span-${lgSpan}`,
    lgStart && `lg:col-start-${lgStart}`,
    xlSpan && `xl:col-span-${xlSpan}`,
    xlStart && `xl:col-start-${xlStart}`,
    className,
  );

  return (
    <div className={cls} id={id}>
      {children}
    </div>
  );
}
