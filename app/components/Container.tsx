import classNames from "classnames";
import type { PropsWithChildren } from "react";
import { BACKGROUND_COLORS } from ".";
import type { CommonWrapperProps } from "./CommonWrapperProps";
import "./container.css";

const DEFAULT_PADDING_TOP = "40";
const DEFAULT_PADDING_BOTTOM = "48";

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
    {
      "!pl-0": !fullScreen && !overhangingBackground,
      "!pr-0": !fullScreen && !overhangingBackground,
    },
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
