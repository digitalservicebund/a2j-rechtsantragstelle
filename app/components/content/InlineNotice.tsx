import SvgCheckCircle from "@digitalservicebund/icons/CheckCircle";
import SvgErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import LightbulbOutlinedIcon from "@digitalservicebund/icons/LightbulbOutlined";
import WarningAmberIcon from "@digitalservicebund/icons/WarningAmber";
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
  isOnFlowPage?: boolean;
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
  isOnFlowPage,
  nested,
}: InlineNoticeProps) => {
  if (!content || removeMarkupTags(content).length === 0) return null;
  const { backgroundColor, borderColor, IconComponent } = lookConfig[look];

  // Form flow pages has content which is controlled by the content pages grid. So the layout is different and need to be handled differently.
  // There is also another case where the inline notice is nested inside of another component, so we need to handle that differently.
  if (nested || isOnFlowPage) {
    return (
      <div
        className={`ds-stack ds-stack-8 scroll-my-40 p-16 ${backgroundColor} md:max-w-[630px] border ${borderColor} border-2 border-l-8`}
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
  }

  return (
    <GridItem
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 7 }}
      xlColumn={{ start: 3, span: 7 }}
    >
      <div
        className={`ds-stack ds-stack-8 scroll-my-40 p-16 ${backgroundColor} md:max-w-[630px] border ${borderColor} border-2 border-l-8`}
        id={identifier}
        role="note"
      >
        <div className="flex flex-row gap-[4px] items-center">
          <IconComponent style={{ width: 24, height: 24, flexShrink: 0 }} />
          <Heading tagName={tagName} look="ds-label-01-bold" text={title} />
        </div>
        <RichText className="tracking-[0.16px] leading-[26px]" html={content} />
      </div>
    </GridItem>
  );
};
