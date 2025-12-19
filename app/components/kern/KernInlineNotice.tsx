import { GridItem } from "~/components/layout/grid/GridItem";
import { removeMarkupTags } from "~/util/strings";
import KernRichText from "./KernRichText";
import { Icon, IconName } from "../common/Icon";

export type KernInlineNoticeProps = {
  identifier?: string;
  title: string;
  tagName: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  look: "warning" | "tips" | "success" | "error";
  content?: string;
  wrap?: boolean;
  nested?: boolean;
};

// We can't set border-[${borderColor}] in the template because it causes inconsistent behavior in Storybook.
// Therefore, it's set in the config.
const lookConfig: Record<
  KernInlineNoticeProps["look"],
  { className: string; icon: IconName }
> = {
  warning: {
    className: "kern-alert--warning",
    icon: "warning",
  },
  tips: {
    className: "kern-alert--info",
    icon: "info",
  },
  success: {
    className: "kern-alert--success",
    icon: "check_circle",
  },
  error: {
    className: "kern-alert--danger",
    icon: "emergency_home",
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
  const { className, icon } = lookConfig[look];
  const Tag = tagName;

  const base = (
    <div className={`kern-alert ${className}`} id={identifier} role="note">
      <div className="flex flex-row items-center pl-kern-space-large h-[48px]">
        <Icon name={icon} className={`kern-icon ${className} mr-8`} aria-hidden="true" />
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
