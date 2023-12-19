import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import RichText from "./RichText";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

const AlertPropsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema.nullable(),
  look: z.enum(["hint"]),
  content: z.string().optional(),
});

type AlertProps = z.infer<typeof AlertPropsSchema>;

const lookConfig = {
  hint: {
    backgroundColor: "bg-yellow-300",
    IconComponent: NotificationsNoneIcon,
  },
};

export const Alert = ({ identifier, heading, look, content }: AlertProps) => {
  const { backgroundColor, IconComponent } = lookConfig[look];

  return (
    <div
      className={`ds-stack-16 scroll-my-40 rounded-lg mt-24 pt-24 pb-32 px-40 ${backgroundColor} md:max-w-[630px]`}
      id={identifier}
    >
      <div className="ds-stack-4">
        <div className="flex flex-row gap-[8px] items-center">
          <IconComponent style={{ width: 28, height: 28 }} />
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
