import LightbulbOutlinedIcon from "@digitalservicebund/icons/LightbulbOutlined";
import WarningAmberIcon from "@digitalservicebund/icons/WarningAmber";
import { removeMarkupTags } from "~/util/strings";
import Heading from "./Heading";
import RichText from "./RichText";

export type InlineNoticeProps = {
  identifier?: string | null;
  title: string;
  tagName: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  look: "warning" | "tips";
  content?: string | null;
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
};

export const InlineNotice = ({
  identifier,
  title,
  tagName,
  look,
  content,
}: InlineNoticeProps) => {
  const { backgroundColor, borderColor, IconComponent } = lookConfig[look];
  const shouldHideNotice = !content || removeMarkupTags(content).length === 0;

  return (
    !shouldHideNotice && (
      <div
        className={`ds-stack-8 scroll-my-40 p-16 ${backgroundColor} md:max-w-[630px] border ${borderColor} border-2 border-l-8`}
        id={identifier ?? undefined}
        role="note"
      >
        <div className="flex flex-row gap-[4px] items-center">
          <IconComponent style={{ width: 24, height: 24, flexShrink: 0 }} />
          <Heading tagName={tagName} look="ds-label-01-bold" text={title} />
        </div>
        <RichText className="tracking-[0.16px] leading-[26px]" html={content} />
      </div>
    )
  );
};
