import classNames from "classnames";
import type { ReactElement } from "react";

interface VisualProps {
  text?: string;
  look?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "large" | "medium" | "small";
  iconLeft?: ReactElement;
  iconRight?: ReactElement;
  fullWidth?: boolean;
}
export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VisualProps {}
export interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    VisualProps {
  href?: string;
}

function Button({
  children,
  text,
  iconLeft,
  iconRight,
  fullWidth,
  look,
  size,
  ...props
}: ButtonProps | ButtonLinkProps) {
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

  const linkProps = props as ButtonLinkProps;

  if (linkProps) {
    return (
      <a {...(props as ButtonLinkProps)} className={buttonClasses}>
        {iconLeft}
        {children ? <span>{children}</span> : text ? <span>{text}</span> : ""}
        {iconRight}
      </a>
    );
  } else {
    return (
      <button {...(props as ButtonProps)} className={buttonClasses}>
        {iconLeft}
        {children ? <span>{children}</span> : text ? <span>{text}</span> : ""}
        {iconRight}
      </button>
    );
  }
}

export default Button;
