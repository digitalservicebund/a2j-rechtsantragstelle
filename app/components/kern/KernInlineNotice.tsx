import { GridItem } from "~/components/layout/grid/GridItem";
import { removeMarkupTags } from "~/util/strings";
import KernRichText from "./KernRichText";
import { KernIcon } from "./common/KernIcon";
import { type IconName } from "./common/utils";

type KernInlineNoticeProps = {
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
  { iconName: IconName; iconClassName: string; containerClassName: string }
> = {
  info: {
    iconName: "info",
    iconClassName: "app-icon--info",
    containerClassName: "kern-alert--info",
  },
  warning: {
    iconName: "warning",
    iconClassName: "app-icon--warning",
    containerClassName: "kern-alert--warning",
  },
  danger: {
    iconName: "emergency-home",
    iconClassName: "app-icon--danger",
    containerClassName: "kern-alert--danger",
  },
  success: {
    iconName: "check-circle",
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
  const { iconName, iconClassName, containerClassName } = lookConfig[look];
  const Tag = tagName;

  const base = (
    <div
      className={`kern-alert ${containerClassName}`}
      id={identifier}
      role="note"
    >
      <div className="flex flex-row items-center pl-kern-space-large h-[48px]">
        <KernIcon
          name={iconName}
          className={`${iconClassName} mr-8`}
          aria-hidden="true"
        />
        <Tag className="kern-body kern-body--bold p-0!"> {title}</Tag>
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
      lgColumn={{ start: 3, span: 7 }}
      xlColumn={{ start: 3, span: 7 }}
    >
      {base}
    </GridItem>
  );
};
