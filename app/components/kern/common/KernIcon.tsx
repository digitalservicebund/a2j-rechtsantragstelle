import { IconPaths, type IconName } from "./utils";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  title?: string;
};
export function KernIcon({
  name,
  size = 24,
  className = "",
  title,
}: Readonly<IconProps>) {
  return (
    <svg
      className={`app-icon ${className} flex-shrink-0`}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      viewBox="0 -960 960 960"
    >
      {title && <title>{title}</title>}
      <path d={IconPaths[name]} />
    </svg>
  );
}
