import { Icon } from "./Icon";
import type { IconName } from "./utils";

type BadgeVariant = "info" | "success" | "warning" | "danger";

type BadgeProps = {
  children: React.ReactNode;
  icon?: IconName;
  variant?: BadgeVariant;
};

export function Badge({ children, icon, variant }: Readonly<BadgeProps>) {
  return (
    <span
      className={`kern-badge${variant ? ` kern-badge--${variant}` : ""}`}
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
          className={`kern-icon${variant ? ` kern-icon--${variant}` : ""}`}
          aria-hidden
        />
      )}
      <span className="kern-label">{children}</span>
    </span>
  );
}
