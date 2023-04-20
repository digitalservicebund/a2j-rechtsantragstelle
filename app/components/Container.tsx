import classNames from "classnames";
import React from "react";
import type { CommonWrapperProps } from ".";
import { BACKGROUND_COLORS } from ".";

const DEFAULT_PADDING_TOP = "40";
const DEFAULT_PADDING_BOTTOM = "48";

export type ContainerProps = {
  children: React.ReactNode;
} & CommonWrapperProps;

export default function Container({
  paddingTop = "default",
  paddingBottom = "default",
  backgroundColor = "default",
  children,
}: ContainerProps) {
  let cssClasses = classNames(
    "container",
    `pt-${paddingTop === "default" ? DEFAULT_PADDING_TOP : paddingTop}`,
    `pb-${paddingBottom === "default" ? DEFAULT_PADDING_BOTTOM : paddingBottom}`
  );

  if (backgroundColor === "default") {
    return <div className={cssClasses}>{children}</div>;
  }

  cssClasses = classNames(
    cssClasses,
    "relative before:content-[''] before:absolute before:inset-y-0 before:-left-32 before:-right-32",
    `before:${BACKGROUND_COLORS[backgroundColor]}`
  );

  return (
    <div className="overflow-x-hidden">
      <div className={cssClasses}>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
