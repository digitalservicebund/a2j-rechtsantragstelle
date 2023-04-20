import classNames from "classnames";
import React from "react";

const DEFAULT_PADDING_TOP = "40";
const DEFAULT_PADDING_BOTTOM = "48";

export interface BackgroundProps {
  color?: "default" | "white" | "blue" | "yellow" | "green" | "yellow" | "red";
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
  children: React.ReactNode;
}

export default function Background({
  color = "default",
  paddingTop = "default",
  paddingBottom = "default",
  children,
}: BackgroundProps) {
  const cssClasses = classNames(
    `pt-${paddingTop === "default" ? DEFAULT_PADDING_TOP : paddingTop}`,
    `pb-${
      paddingBottom === "default" ? DEFAULT_PADDING_BOTTOM : paddingBottom
    }`,
    {
      "bg-white": color === "white",
      "bg-blue-100": color === "blue",
      "bg-yellow-300": color === "yellow",
      "bg-green-200": color === "green",
      "bg-[#f9e5ec]": color === "red",
    }
  );

  return <div className={cssClasses}>{children}</div>;
}
