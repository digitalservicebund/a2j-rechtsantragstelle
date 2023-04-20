import classNames from "classnames";
import React from "react";

const DEFAULT_PADDING_TOP = "40";
const DEFAULT_PADDING_BOTTOM = "48";

export interface ContainerProps {
  paddingTop?:
    | "default"
    | "0"
    | "8"
    | "16"
    | "24"
    | "32"
    | "40"
    | "48"
    | "56"
    | "64";
  paddingBottom?:
    | "default"
    | "0"
    | "8"
    | "16"
    | "24"
    | "32"
    | "40"
    | "48"
    | "56"
    | "64";
  backgroundColor?: "default" | "white" | "blue" | "yellow";
  children: React.ReactNode;
}

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

  cssClasses = classNames(cssClasses, {
    "relative before:content-[''] before:absolute before:inset-y-0 before:-left-32 before:-right-32":
      backgroundColor,
    "before:bg-blue-100": backgroundColor === "blue",
    "before:bg-yellow-300": backgroundColor === "yellow",
    "before:bg-white": backgroundColor === "white",
  });

  return (
    <div className="overflow-x-hidden">
      <div className={cssClasses}>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
