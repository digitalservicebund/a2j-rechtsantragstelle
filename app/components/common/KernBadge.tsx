import { Icon } from "./Icon";
import type { IconName } from "./utils";

type KernBadgeVariant = "info" | "success" | "warning" | "danger";

type KernBadgeProps = {
  children: React.ReactNode;
  icon?: IconName;
  variant?: KernBadgeVariant;
};

export function KernBadge({
  children,
  icon,
  variant,
}: Readonly<KernBadgeProps>) {
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
