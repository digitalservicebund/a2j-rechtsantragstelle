import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";

type AddArrayItemButtonProps = {
  href: string;
  disabled?: boolean;
  dataTestId?: string;
  buttonText: string;
  additionalContent?: React.ReactNode;
};

export const AddArrayItemButton = ({
  href,
  disabled,
  buttonText,
  additionalContent,
  dataTestId,
}: AddArrayItemButtonProps) => {
  return (
    <div className="flex flex-col items-start gap-24 p-kern-space-default border border-dashed border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) bg-kern-white">
      {additionalContent}

      <Button
        look="secondary"
        iconLeft={<Icon name="plus" className="text-kern-action-default" />}
        href={href}
        data-testid={dataTestId ?? "add-array-item"}
        fullWidth={true}
        disabled={disabled}
        aria-disabled={disabled}
      >
        {buttonText}
      </Button>
    </div>
  );
};
