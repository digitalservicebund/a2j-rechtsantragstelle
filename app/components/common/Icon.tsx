import { type IconName, IconPaths } from "./utils";

type IconProps = {
  name: IconName;
  id?: string;
  size?: number;
  className?: string;
  title?: string;
  ariaLabel?: string;
};
export function Icon({
  name,
  id,
  size = 24,
  className = "",
  title,
  ariaLabel,
}: Readonly<IconProps>) {
  return (
    <svg
      className={`app-icon ${className} flex-shrink-0`}
      width={size}
      height={size}
      id={id}
      fill="currentColor"
      aria-hidden={ariaLabel ? "false" : "true"}
      aria-label={ariaLabel}
      viewBox="0 -960 960 960"
      data-testid={`icon-${name}`}
    >
      {title && <title>{title}</title>}
      <path d={IconPaths[name]} />
    </svg>
  );
}
