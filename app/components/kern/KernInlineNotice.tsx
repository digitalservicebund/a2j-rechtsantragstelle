import { GridItem } from "~/components/layout/grid/GridItem";
import { removeMarkupTags } from "~/util/strings";
import KernRichText from "./KernRichText";

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
const lookConfig = {
  warning: {
    className: "kern-alert--warning",
    iconClass: "kern-icon--warning",
  },
  tips: {
    className: "kern-alert--info",
    iconClass: "kern-icon--info",
  },
  success: {
    className: "kern-alert--success",
    iconClass: "kern-icon--success",
  },
  error: {
    className: "kern-alert--danger",
    iconClass: "kern-icon--danger",
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
  const { className, iconClass } = lookConfig[look];
  const Tag = tagName;

  const base = (
    <div className={`kern-alert ${className}`} id={identifier} role="note">
      <div className="flex flex-row items-center pl-kern-space-large h-[48px]">
        <span className={`kern-icon ${iconClass} mr-8`} aria-hidden="true" />
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
