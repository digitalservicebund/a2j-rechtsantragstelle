import classNames from "classnames";
import type { PropsWithChildren } from "react";
import { BACKGROUND_COLORS, type BackgroundColor } from ".";

const DEFAULT_PADDING_TOP = "40";
const DEFAULT_PADDING_BOTTOM = "48";

export type Padding =
  | "default"
  | "0" // !pt-0 !pb-0
  | "8" // !pt-8 !pb-8
  | "16" // !pt-16 !pb-16
  | "24" // !pt-24 !pb-24
  | "32" // !pt-32 !pb-32
  | "40" // !pt-40 !pb-40
  | "48" // !pt-48 !pb-48
  | "56" // !pt-56 !pb-56
  | "64"; // !pt-64 !pb-64

export type CommonWrapperProps = {
  backgroundColor?: BackgroundColor;
  paddingTop?: Padding;
  paddingBottom?: Padding;
  fullScreen?: boolean;
};

type ContainerProps = {
  readonly overhangingBackground?: boolean;
} & PropsWithChildren<CommonWrapperProps>;

export default function Container({
  paddingTop = "default",
  paddingBottom = "default",
  backgroundColor = "default",
  overhangingBackground,
  fullScreen = true,
  children,
}: ContainerProps) {
  let cssClasses = classNames(
    "container",
    `!pt-${paddingTop === "default" ? DEFAULT_PADDING_TOP : paddingTop}`,
    `!pb-${
      paddingBottom === "default" ? DEFAULT_PADDING_BOTTOM : paddingBottom
    }`,
    backgroundColor !== "default" && "text-black",
    "!pl-0",
    "!pr-0",
    "!max-w-full",
  );

  if (backgroundColor === "default") {
    return <div className={cssClasses}>{children}</div>;
  }

  if (backgroundColor && overhangingBackground) {
    cssClasses = classNames(
      cssClasses,
      "relative before:content-[''] before:absolute before:inset-y-0 before:-left-32 before:-right-32 before:rounded-lg",
      `before:${BACKGROUND_COLORS[backgroundColor]}`,
    );

    // Matches padding of .container (see style.css)
    const style = fullScreen
      ? {
          marginLeft: "clamp(1rem, 5vw, 3rem)",
          marginRight: "clamp(1rem, 5vw, 3rem)",
        }
      : {};
    return (
      <div className="overflow-x-hidden rounded-lg" style={style}>
        <div className={cssClasses}>
          <div className="relative">{children}</div>
        </div>
      </div>
    );
  }

  if (backgroundColor) {
    cssClasses = classNames(cssClasses, BACKGROUND_COLORS[backgroundColor]);
  }

  return <div className={cssClasses}>{children}</div>;
}
