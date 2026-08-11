import { Icon } from "./Icon";
import type { IconName } from "./utils";

type BadgeVariant = "info" | "success" | "warning" | "danger";

type BadgeProps = {
  children: React.ReactNode;
  icon?: IconName;
  variant?: BadgeVariant;
};

export function Badge({ children, icon, variant }: Readonly<BadgeProps>) {
  const badgeClass = variant ? `kern-badge kern-badge--${variant}` : "kern-badge";
  const iconClass = variant ? `kern-icon kern-icon--${variant}` : "kern-icon";

  return (
    <span
      className={badgeClass}
      style={
        !variant
          ? {
              border:
                "var(--kern-metric-border-width-light, 1px) solid var(--kern-color-layout-border, #A5AAC3)",
            }
          : undefined
      }
    >
      {icon && (
        <Icon
          name={icon}
          className={iconClass}
          aria-hidden
        />
      )}
      <span className="kern-label">{children}</span>
    </span>
  );
}
