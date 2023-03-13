import classNames from "classnames";
import type { ReactElement } from "react";

interface VisualProps {
  size?: "large" | "medium" | "small";
  iconLeft?: ReactElement;
  iconRight?: ReactElement;
}
interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VisualProps {}
interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    VisualProps {}

const Button = (props: ButtonProps | ButtonLinkProps) => {
  const { children, iconLeft, iconRight, ...rest } = props;
  const isLink = "href" in props;
  const buttonClasses = classNames("ds-button", props.className, {
    "ds-button-large": props.size == "large",
    "ds-button-small": props.size == "small",
    "ds-button-with-icon": iconLeft || iconRight,
  });

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
