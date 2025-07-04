import classNames from "classnames";
import type { PropsWithChildren } from "react";
import { BACKGROUND_COLORS } from ".";
import type { CommonWrapperProps } from "./Container";

const DEFAULT_PADDING_TOP = "0";
const DEFAULT_PADDING_BOTTOM = "0";

type BackgroundProps = PropsWithChildren<CommonWrapperProps>;

export default function Background({
  backgroundColor = "default",
  paddingTop = "default",
  paddingBottom = "default",
  children,
}: BackgroundProps) {
  const cssClasses = classNames(
    backgroundColor !== "default" && BACKGROUND_COLORS[backgroundColor],
    `!pt-${paddingTop === "default" ? DEFAULT_PADDING_TOP : paddingTop}`,
    `!pb-${
      paddingBottom === "default" ? DEFAULT_PADDING_BOTTOM : paddingBottom
    }`,
    backgroundColor === "darkBlue" && "text-white",
    "contrast-more:border-y-2 contrast-more:border-black",
  );

  return <div className={cssClasses}>{children}</div>;
}
