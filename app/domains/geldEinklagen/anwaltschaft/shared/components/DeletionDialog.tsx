import { type ReactNode } from "react";
import { Icon } from "~/components/common/Icon";
import { type IconName } from "~/components/common/utils";
import { InlineNotice } from "~/components/content/InlineNotice";
import { translations } from "~/services/translations/translations";

export type DeletionWarning = {
  title: string;
  auswirkungenText: string | React.ReactNode;
  keepAndEditText: string;
  deletePermanentlyText: string;
};

export type DeletionDialogProps = {
  description: string;
  itemIcon: IconName;
  itemLabel: ReactNode;
  /** Shown as a warning notice above the description, e.g. when connected data will also be affected */
  warning?: DeletionWarning;
};

const DeletionWarningText = ({
  auswirkungenText,
  keepAndEditText,
  deletePermanentlyText,
}: Omit<DeletionWarning, "title">) => (
  <div className="flex flex-col gap-kern-space-small kern-body">
    <span className="kern-body--bold">
      {translations.geldEinklagenAnwaltschaft.auswirkungen.de}
    </span>
    <span className="kern-body--default">{auswirkungenText}</span>
    <span className="kern-body--bold">
      {translations.geldEinklagenAnwaltschaft.dasKoennenSieTun.de}:
    </span>
    <ul className="list-disc pl-kern-dimension-large">
      <li>
        <span className="kern-body--bold">
          {translations.geldEinklagenAnwaltschaft.keepAndEdit.de}:{" "}
        </span>
        <span className="kern-body--default">{keepAndEditText}</span>
      </li>
      <li>
        <span className="kern-body--bold">
          {translations.geldEinklagenAnwaltschaft.deletePermanently.de}:{" "}
        </span>
        <span className="kern-body--default">{deletePermanentlyText}</span>
      </li>
    </ul>
  </div>
);

export const DeletionDialog = ({
  description,
  itemIcon,
  itemLabel,
  warning,
}: DeletionDialogProps) => (
  <div className="flex flex-col gap-kern-space-default">
    {warning && (
      <InlineNotice
        title={warning.title}
        tagName="p"
        look="warning"
        content={<DeletionWarningText {...warning} />}
      />
    )}
    <div className="flex flex-col gap-kern-space-small">
      <p className="kern-body kern-body--default">{description}</p>
      <div className="flex gap-kern-space-small items-start">
        <Icon name={itemIcon} className="size-kern-dimension-default" />
        <p className="font-bold">{itemLabel}</p>
      </div>
    </div>
  </div>
);
