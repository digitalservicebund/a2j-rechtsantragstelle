import { GridItem } from "~/components/layout/grid/GridItem";
import { removeMarkupTags } from "~/util/strings";
import KernRichText from "./KernRichText";
import { Icon } from "../common/Icon";
import { type IconName } from "../common/utils";
import { translations } from "~/services/translations/translations";

export type KernInlineNoticeProps = {
  identifier?: string;
  title: string;
  tagName: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  look: "info" | "warning" | "danger" | "success";
  content?: string;
  wrap?: boolean;
  nested?: boolean;
};

// We can't set border-[${borderColor}] in the template because it causes inconsistent behavior in Storybook.
// Therefore, it's set in the config.
const lookConfig: Record<
  KernInlineNoticeProps["look"],
  {
    iconName: IconName;
    ariaLabel: string;
    iconClassName: string;
    containerClassName: string;
  }
> = {
  info: {
    iconName: "info",
    ariaLabel: translations.inlineNotice.infoIcon.de,
    iconClassName: "app-icon--info",
    containerClassName: "kern-alert--info",
  },
  warning: {
    iconName: "warning",
    ariaLabel: translations.inlineNotice.warningIcon.de,
    iconClassName: "app-icon--warning",
    containerClassName: "kern-alert--warning",
  },
  danger: {
    iconName: "emergency-home",
    ariaLabel: translations.inlineNotice.errorIcon.de,
    iconClassName: "app-icon--danger",
    containerClassName: "kern-alert--danger",
  },
  success: {
    iconName: "check-circle",
    ariaLabel: translations.inlineNotice.successIcon.de,
    iconClassName: "app-icon--success",
    containerClassName: "kern-alert--success",
  },
};

export const KernInlineNotice = ({
  identifier,
  title,
  tagName,
  look,
  content,
  wrap,
  nested,
}: KernInlineNoticeProps) => {
  if (!content || removeMarkupTags(content).length === 0) return null;
  const { iconName, iconClassName, containerClassName, ariaLabel } =
    lookConfig[look];
  const Tag = tagName;

  const base = (
    <div
      className={`kern-alert ${containerClassName}`}
      id={identifier}
      role="note"
    >
      <div className="kern-alert__header">
        <Icon
          name={iconName}
          ariaLabel={ariaLabel}
          className={`${iconClassName} mr-8 forced-color-adjust-auto`}
        />
        <Tag className="kern-body kern-body--bold p-0! outline-none!">
          {" "}
          {title}
        </Tag>
      </div>
      <div className="kern-alert__body">
        <KernRichText html={content} />
      </div>
    </div>
  );

  if (nested || wrap) {
    return base;
  }

  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
    >
      {base}
    </GridItem>
  );
};
