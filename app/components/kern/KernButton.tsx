import classNames from "classnames";
import { cloneElement, type ReactElement } from "react";
import { isExternalUrl, isFileDownloadUrl } from "~/util/url";

type ReactElementWithClassname = ReactElement<{ className: string }>;

export type ButtonProps = {
  text?: string;
  look?: "primary" | "secondary" | "tertiary" | "ghost";
  href?: string;
  iconLeft?: ReactElementWithClassname;
  iconRight?: ReactElementWithClassname;
  fullWidth?: boolean;
  textClassName?: string;
  type?: HTMLButtonElement["type"];
};

type LinkProps = React.ComponentPropsWithoutRef<"a">;

function formatIcon(icon?: ReactElementWithClassname) {
  if (!icon) return undefined;
  const className = `${icon.props.className ?? ""}`;
  return cloneElement(icon, { className });
}

// for links that look like buttons, we want to add an event handler so that it can
// be activated with the space bar
// see: https://github.com/digitalservicebund/a2j-rechtsantragstelle/commit/43710c9e7d59e06f304830cc7e6b92893e7c7aa1#commitcomment-144257987
const onKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
  if (event.code === "Space") {
    event.currentTarget.click();
    event.preventDefault();
  }
};

function KernButton({
  children,
  text,
  iconLeft,
  iconRight,
  fullWidth,
  look,
  href,
  textClassName,
  disabled,
  ...props
}: ButtonProps & LinkProps & React.ComponentPropsWithRef<"button">) {
  const buttonClasses = classNames(
    "kern-btn",
    {
      "kern-btn--primary": !look || look === "primary",
      "kern-btn--secondary": look === "secondary",
      "kern-btn--tertiary": look === "tertiary",
      "kern-btn--block": fullWidth,
      "kern-btn--disabled pointer-events-none": disabled,
    },
    props.className,
  );

  const textSpan = text ? (
    <span className={classNames("kern-label", textClassName)}>{text}</span>
  ) : (
    ""
  );
  const childrenSpan = (
    <span className={classNames("kern-label", textClassName)}>{children}</span>
  );
  iconLeft = formatIcon(iconLeft);
  iconRight = formatIcon(iconRight);

  if (href) {
    const isExternal = isExternalUrl(href);
    const isFile = isFileDownloadUrl(href);
    const opts =
      isFile || isExternal ? { target: "_blank", rel: "noopener" } : {};
    if (isExternal) opts.rel = "noopener noreferrer";

    return (
      <a
        {...(props as LinkProps)}
        href={disabled ? undefined : href}
        className={buttonClasses}
        onKeyDown={onKeyDown}
        {...opts}
      >
        {iconLeft} {children ? childrenSpan : textSpan} {iconRight}
      </a>
    );
  }

  return (
    <button
      {...(props as ButtonProps)}
      className={buttonClasses}
      disabled={disabled}
    >
      {iconLeft} {children ? childrenSpan : textSpan} {iconRight}
    </button>
  );
}

export default KernButton;
