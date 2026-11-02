import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";

export type ArrayItemEditButtonProps = {
  href: string;
  ariaLabel: string;
  id?: string;
  onClick?: () => void;
};

export const ArrayItemEditButton = ({
  href,
  ariaLabel,
  id,
  onClick,
}: ArrayItemEditButtonProps) => (
  <Button
    id={id}
    look="secondary"
    iconLeft={
      <Icon
        name="edit"
        className="size-kern-dimension-default text-kern-action-default"
      />
    }
    aria-label={ariaLabel}
    href={href}
    onClick={onClick}
    className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
  />
);
