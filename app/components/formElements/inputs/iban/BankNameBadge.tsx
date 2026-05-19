import { Icon } from "~/components/common/Icon";

export const BankNameBadge = ({
  bankNameBadgeId,
  bankName,
}: {
  bankNameBadgeId: string;
  bankName?: string;
}) => {
  return bankName ? (
    <output
      id={bankNameBadgeId}
      className="kern-badge kern-badge-info border-2 border-kern-feedback-info bg-kern-feedback-info-background min-w-fit w-min"
    >
      <Icon name="info" className="fill-kern-feedback-info" />
      <span className="kern-label kern-label--small">{bankName}</span>
    </output>
  ) : null;
};
