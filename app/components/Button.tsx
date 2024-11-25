import classNames from "classnames";
import { cloneElement, type ReactElement } from "react";
import { isExternalUrl, isFileDownloadUrl } from "~/util/url";

type ReactElementWithClassname = ReactElement<{ className: string }>;

export type ButtonProps = {
  text?: string;
  look?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "large" | "medium" | "small";
  href?: string;
  iconLeft?: ReactElementWithClassname;
  iconRight?: ReactElementWithClassname;
  fullWidth?: boolean;
};

type LinkProps = React.ComponentPropsWithoutRef<"a">;

function formatIcon(icon?: ReactElementWithClassname) {
  if (!icon) return undefined;
  const className = `ds-button-icon ${icon.props.className ?? ""}`;
  return cloneElement(icon, { className });
}

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
}: ButtonProps & LinkProps & React.ComponentPropsWithoutRef<"button">) {
  const buttonClasses = classNames(
    "ds-button",
    {
      "ds-button-secondary": look == "secondary",
      "ds-button-tertiary": look == "tertiary",
      "ds-button-ghost": look == "ghost",
      "ds-button-large": size == "large",
      "ds-button-small": size == "small",
      "ds-button-with-icon": iconLeft ?? iconRight,
      "ds-button-with-icon-only": (iconLeft ?? iconRight) && !children,
      "ds-button-full-width": fullWidth,
    },
    "contrast-more:border-4 forced-colors:border-4 border-solid contrast-more:border-black", // TODO: move into angie?
    props.className,
  );

  const textSpan = text ? <span className="ds-button-label">{text}</span> : "";
  const childrenSpan = <span className="ds-button-label">{children}</span>;
  iconLeft = formatIcon(iconLeft);
  iconRight = formatIcon(iconRight);

  // for links that look like buttons, we want to add an event handler so that it can
  // be activated with the space bar
  // see: https://github.com/digitalservicebund/a2j-rechtsantragstelle/commit/43710c9e7d59e06f304830cc7e6b92893e7c7aa1#commitcomment-144257987
  const onKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (event.code === "Space") {
      event.currentTarget.click();
      event.preventDefault();
    }
  };

  if (href) {
    const isExternal = isExternalUrl(href);
    const isFile = isFileDownloadUrl(href);
    const opts =
      isFile || isExternal ? { target: "_blank", rel: "noopener" } : {};
    if (isExternal) opts.rel = "noopener noreferrer";

    return (
      <a
        {...props}
        href={href}
        className={buttonClasses}
        onKeyDown={onKeyDown}
        {...opts}
      >
        {iconLeft} {children ? childrenSpan : textSpan} {iconRight}
      </a>
    );
  }

  return (
    <button {...(props as ButtonProps)} className={buttonClasses}>
      {iconLeft} {children ? childrenSpan : textSpan} {iconRight}
    </button>
  );
}

export default Button;
