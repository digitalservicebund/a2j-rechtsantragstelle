import classNames from "classnames";
import type { ReactElement } from "react";

interface VisualProps {
  look?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "large" | "medium" | "small";
  iconLeft?: ReactElement;
  iconRight?: ReactElement;
  fullWidth?: boolean;
}
interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VisualProps {}
interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    VisualProps {}

const Button = (props: ButtonProps | ButtonLinkProps) => {
  const { children, iconLeft, iconRight, fullWidth, look, size, ...rest } =
    props;
  const isLink = "href" in props;
  const buttonClasses = classNames(
    "ds-button",
    {
      "ds-button-secondary": look == "secondary",
      "ds-button-tertiary": look == "tertiary",
      "ds-button-ghost": look == "ghost",
      "ds-button-large": size == "large",
      "ds-button-small": size == "small",
      "ds-button-with-icon": iconLeft || iconRight,
      "ds-button-with-icon-only": (iconLeft || iconRight) && !children,
      "ds-button-full-width": fullWidth,
    },
    props.className
  );

  if (isLink) {
    return (
      <a {...(rest as ButtonLinkProps)} className={buttonClasses}>
        {iconLeft}
        {children}
        {iconRight}
      </a>
    );
  } else {
    return (
      <button {...(rest as ButtonProps)} className={buttonClasses}>
        {iconLeft}
        {children}
        {iconRight}
      </button>
    );
  }
};

export default Button;
