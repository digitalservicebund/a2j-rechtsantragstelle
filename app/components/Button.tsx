import classNames from "classnames";
import type { ReactElement } from "react";
import { z } from "zod";

export const ButtonPropsSchema = z.object({
  text: z.string().optional(),
  look: z.enum(["primary", "secondary", "tertiary", "ghost"]).optional(),
  size: z.enum(["large", "medium", "small"]).optional(),
  href: z.string().optional(),
  iconLeft: z.custom<ReactElement>().optional(),
  iconRight: z.custom<ReactElement>().optional(),
  fullWidth: z.boolean().optional(),
});

type Props = z.infer<typeof ButtonPropsSchema>;

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    Props {}

export interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    Props {}

function Button({
  children,
  text,
  iconLeft,
  iconRight,
  fullWidth,
  look,
  size,
  href,
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

  if (href) {
    return (
      <a {...(props as ButtonLinkProps)} href={href} className={buttonClasses}>
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
