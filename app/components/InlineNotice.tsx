import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import RichText from "./RichText";
import LightbulbOutlinedIcon from "@digitalservicebund/icons/LightbulbOutlined";
import WarningAmberIcon from "@digitalservicebund/icons/WarningAmber";

const InlineNoticePropsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema.nullable(),
  look: z.enum(["warning", "tips"]),
  content: z.string().optional(),
});

type InlineNoticeProps = z.infer<typeof InlineNoticePropsSchema>;

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
  heading,
  look,
  content,
}: InlineNoticeProps) => {
  const { backgroundColor, borderColor, IconComponent } = lookConfig[look];

  return (
    <div
      className={`ds-stack-16 scroll-my-40 pt-24 pb-32 px-40 ${backgroundColor} md:max-w-[630px] border ${borderColor} border-2 border-l-8`}
      id={identifier}
    >
      <div className="ds-stack-4">
        <div className="flex flex-row gap-[8px] items-center">
          <IconComponent style={{ width: 24, height: 24 }} />
          {heading && <Heading {...heading} />}
        </div>
        {content && (
          <div className="tracking-[0.16px] leading-[26px]">
            {content && <RichText markdown={content} />}
          </div>
        )}
      </div>
    </div>
  );
};
