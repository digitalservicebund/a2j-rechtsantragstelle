import { GridItem } from "~/components/layout/grid/GridItem";
import { removeMarkupTags } from "~/util/strings";
import RichText from "../common/RichText";
import { Icon } from "../common/Icon";
import { type IconName } from "../common/utils";
import classNames from "classnames";
import { componentsTranslations } from "~/services/translations/components";

export type InlineNoticeProps = {
  identifier?: string;
  title: string;
  tagName: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  look: "info" | "warning" | "danger" | "success";
  content?: string;
  wrap?: boolean;
  nested?: boolean;
  className?: string;
};

// We can't set border-[${borderColor}] in the template because it causes inconsistent behavior in Storybook.
// Therefore, it's set in the config.
const lookConfig: Record<
  InlineNoticeProps["look"],
  {
    iconName: IconName;
    ariaLabel: string;
    iconClassName: string;
    containerClassName: string;
  }
> = {
  info: {
    iconName: "info",
    ariaLabel: componentsTranslations.inlineNotice.infoIcon.de,
    iconClassName: "app-icon--info",
    containerClassName: "kern-alert--info",
  },
  warning: {
    iconName: "warning",
    ariaLabel: componentsTranslations.inlineNotice.warningIcon.de,
    iconClassName: "app-icon--warning",
    containerClassName: "kern-alert--warning",
  },
  danger: {
    iconName: "emergency-home",
    ariaLabel: componentsTranslations.inlineNotice.errorIcon.de,
    iconClassName: "app-icon--danger",
    containerClassName: "kern-alert--danger",
  },
  success: {
    iconName: "check-circle",
    ariaLabel: componentsTranslations.inlineNotice.successIcon.de,
    iconClassName: "app-icon--success",
    containerClassName: "kern-alert--success",
  },
};

export const InlineNotice = ({
  identifier,
  title,
  tagName,
  look,
  content,
  wrap,
  nested,
  className,
}: InlineNoticeProps) => {
  if (!content || removeMarkupTags(content).length === 0) return null;
  const { iconName, iconClassName, containerClassName, ariaLabel } =
    lookConfig[look];
  const Tag = tagName;

  const base = (
    <div
      className={classNames("kern-alert", containerClassName, className)}
      id={identifier}
      role="note"
    >
      <div className="kern-alert__header">
        <Icon
          name={iconName}
          ariaLabel={ariaLabel}
          className={`${iconClassName} mr-8`}
        />
        <Tag className="kern-body kern-body--bold p-0! outline-none!">
          {" "}
          {title}
        </Tag>
      </div>
      <div className="kern-alert__body">
        <RichText html={content} />
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
