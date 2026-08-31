import classNames from "classnames";
import { Icon } from "~/components/common/Icon";
import { type IconName } from "~/components/common/utils";

type Props = {
  icon: IconName;
  content: React.ReactNode;
  buttons?: React.ReactNode;
  classNameParent?: string;
  classNameChild?: string;
};

export const BeweisItemRow = ({
  icon,
  content,
  buttons,
  classNameParent,
  classNameChild,
}: Props) => (
  <div
    className={classNames(
      "flex sm:flex-row sm:items-center flex-col gap-kern-space-default py-kern-space-default",
      classNameParent,
    )}
  >
    <div
      className={classNames(
        "flex sm:flex-row flex-col items-start gap-kern-space-small flex-1 min-w-0",
        classNameChild,
      )}
    >
      <Icon name={icon} className="shrink-0" />
      {content}
    </div>
    {buttons && (
      <div className="flex items-center gap-24 shrink-0">{buttons}</div>
    )}
  </div>
);
