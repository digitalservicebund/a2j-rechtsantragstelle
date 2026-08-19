import classNames from "classnames";
import { Icon } from "~/components/common/Icon";
import { type IconName } from "~/components/common/utils";

type Props = {
  icon: IconName;
  content: React.ReactNode;
  buttons?: React.ReactNode;
  className?: string;
};

export const BeweisItemRow = ({ icon, content, buttons, className }: Props) => (
  <div
    className={classNames(
      "flex md:flex-row flex-col gap-kern-space-default py-kern-space-default",
      className,
    )}
  >
    <div className="flex md:flex-row flex-col items-start gap-kern-space-small flex-1 min-w-0">
      <Icon name={icon} className="shrink-0" />
      {content}
    </div>
    {buttons && (
      <div className="flex items-center gap-24 shrink-0">{buttons}</div>
    )}
  </div>
);
