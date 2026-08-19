import classNames from "classnames";
import { Icon } from "./Icon";
import type { IconName } from "./utils";

type BadgeVariant = "info" | "success" | "warning" | "danger";

type BadgeProps = {
  children: React.ReactNode;
  icon?: IconName;
  variant?: BadgeVariant;
};

export function Badge({ children, icon, variant }: Readonly<BadgeProps>) {
  const iconClass = variant ? `kern-icon kern-icon--${variant}` : "kern-icon";

  return (
    <span
      className={classNames("kern-badge gap-kern-space-small", {
        [`kern-badge--${variant}`]: variant,
      })}
      style={
        !variant
          ? {
              border:
                "var(--kern-metric-border-width-light, 1px) solid var(--kern-color-layout-border, #A5AAC3)",
            }
          : undefined
      }
    >
      {icon && <Icon name={icon} className={iconClass} aria-hidden />}
      <span className="kern-label--small pt-0!">{children}</span>
    </span>
  );
}
