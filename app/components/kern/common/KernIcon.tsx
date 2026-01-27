import { IconPaths, type IconName } from "./utils";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};
export function KernIcon({
  name,
  size = 24,
  className = "",
}: Readonly<IconProps>) {
  return (
    <svg
      className={`app-icon ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      viewBox="0 -960 960 960"
    >
      <path d={IconPaths[name]} />
    </svg>
  );
}
