import classNames from "classnames";
import React from "react";
import type { CommonWrapperProps } from ".";
import { BACKGROUND_COLORS } from ".";

const DEFAULT_PADDING_TOP = "40";
const DEFAULT_PADDING_BOTTOM = "48";

export type BackgroundProps = {
  children: React.ReactNode;
} & CommonWrapperProps;

export default function Background({
  backgroundColor = "default",
  paddingTop = "default",
  paddingBottom = "default",
  children,
}: BackgroundProps) {
  const cssClasses = classNames(
    backgroundColor !== "default" && BACKGROUND_COLORS[backgroundColor],
    `pt-${paddingTop === "default" ? DEFAULT_PADDING_TOP : paddingTop}`,
    `pb-${paddingBottom === "default" ? DEFAULT_PADDING_BOTTOM : paddingBottom}`
  );

  return <div className={cssClasses}>{children}</div>;
}
