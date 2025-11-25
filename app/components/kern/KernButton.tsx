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
  type?: HTMLButtonElement["type"];
};

type LinkProps = React.ComponentPropsWithoutRef<"a">;

function formatIcon(icon?: ReactElementWithClassname) {
  if (!icon) return undefined;
  const className = `kern-icon ${icon.props.className ?? ""}`;
  return cloneElement(icon, { className });
}

function KernButton({
  children,
  text,
  iconLeft,
  iconRight,
  fullWidth,
  look,
  size,
  href,
  ...props
}: ButtonProps & LinkProps & React.ComponentPropsWithRef<"button">) {
  const buttonClasses = classNames(
    "kern-btn",
    {
      "kern-btn--primary": !look || look === "primary",
      "kern-btn--secondary": look === "secondary",
      "kern-btn--tertiary": look === "tertiary",
      "kern-btn--block": fullWidth,
    },
    props.className,
  );

  const textSpan = text ? <span className="kern-label">{text}</span> : "";
  const childrenSpan = <span className="kern-label">{children}</span>;
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
        {...(props as LinkProps)}
        href={props.disabled ? undefined : href}
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

export default KernButton;
