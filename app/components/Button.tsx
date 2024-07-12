import classNames from "classnames";
import { cloneElement, type ReactElement } from "react";
import { z } from "zod";
import { isExternalUrl } from "~/util/isExternalUrl";

const iconSchema = z.custom<ReactElement<{ className: string }>>().optional();

export const ButtonPropsSchema = z.object({
  text: z.string().optional(),
  look: z.enum(["primary", "secondary", "tertiary", "ghost"]).optional(),
  size: z.enum(["large", "medium", "small"]).optional(),
  href: z.string().optional(),
  iconLeft: iconSchema,
  iconRight: iconSchema,
  fullWidth: z.boolean().optional(),
  downloadFile: z.string().optional(),
});

type Props = z.infer<typeof ButtonPropsSchema>;

interface ButtonProps extends React.ComponentPropsWithoutRef<"button">, Props {}
interface ButtonLinkProps extends React.ComponentPropsWithoutRef<"a">, Props {}

function formatIcon(icon: z.infer<typeof iconSchema>) {
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
  downloadFile,
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

  // for links that have role="button" we need to add an event handler so that it can
  // be activated with the space bar
  // see: https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
  const onKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (event.code === "Space") {
      event.currentTarget.click();
      event.preventDefault();
    }
  };

  if (href) {
    const isExternal = isExternalUrl(href);
    return (
      <a
        data-testid="custom-button"
        {...(props as ButtonLinkProps)}
        href={href}
        className={buttonClasses}
        onKeyDown={onKeyDown}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...(downloadFile && downloadFile !== ""
          ? { download: downloadFile }
          : {})}
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
