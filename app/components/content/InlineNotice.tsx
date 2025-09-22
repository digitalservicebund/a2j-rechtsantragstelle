import SvgCheckCircle from "@digitalservicebund/icons/CheckCircle";
import SvgErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import LightbulbOutlinedIcon from "@digitalservicebund/icons/LightbulbOutlined";
import WarningAmberIcon from "@digitalservicebund/icons/WarningAmber";
import classNames from "classnames";
import Heading from "~/components/common/Heading";
import RichText from "~/components/common/RichText";
import { GridItem } from "~/components/layout/grid/GridItem";
import { removeMarkupTags } from "~/util/strings";

export type InlineNoticeProps = {
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
    backgroundColor: "bg-yellow-200",
    borderColor: "border-[#E5CE5C]",
    IconComponent: WarningAmberIcon,
  },
  tips: {
    backgroundColor: "bg-gray-100",
    borderColor: "border-[#B8BDC3]",
    IconComponent: LightbulbOutlinedIcon,
  },
  success: {
    backgroundColor: "bg-green-100",
    borderColor: "border-green-700",
    IconComponent: () => SvgCheckCircle({ style: { color: "#01854A" } }),
  },
  error: {
    backgroundColor: "bg-red-200",
    borderColor: "border-red-900",
    IconComponent: () => SvgErrorOutline({ style: { color: "#8E001B" } }),
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
}: InlineNoticeProps) => {
  if (!content || removeMarkupTags(content).length === 0) return null;
  const { backgroundColor, borderColor, IconComponent } = lookConfig[look];

  const base = (
    <div
      className={classNames(
        "ds-stack ds-stack-8 scroll-my-40 p-16",
        backgroundColor,
        "border",
        borderColor,
        "border-2 border-l-8",
        nested || wrap ? "md:max-w-[630px]" : "",
      )}
      id={identifier}
      role="note"
    >
      <div className="flex flex-row gap-[4px] items-center">
        <IconComponent style={{ width: 24, height: 24, flexShrink: 0 }} />
        <Heading tagName={tagName} look="ds-label-01-bold" text={title} />
      </div>
      <RichText className="tracking-[0.16px] leading-[26px]" html={content} />
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
