import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import RichText, { RichTextPropsSchema } from "./RichText";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export const NotificationProsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema.optional(),
  look: z.enum(["hint"]),
  content: RichTextPropsSchema.optional(),
});

type NotificationProps = z.infer<typeof NotificationProsSchema>;

const lookConfig = {
  hint: {
    backgroundColor: "bg-yellow-500",
    IconComponent: NotificationsNoneIcon,
  },
};

export const Notification = ({
  identifier,
  heading,
  look,
  content,
}: NotificationProps) => {
  const { backgroundColor, IconComponent } = lookConfig[look];

  return (
    <div
      className={`ds-stack-16 scroll-my-40 rounded-lg pt-24 pb-32 px-40 ${backgroundColor} md:max-w-[630px]`}
      id={identifier}
    >
      <div className="ds-stack-4">
        <div className="flex flex-row gap-[8px] items-center">
          <IconComponent style={{ width: 28, height: 28 }} />
          {heading && <Heading {...heading} />}
        </div>
        {content && (
          <div className="tracking-[0.16px] leading-[26px]">
            <RichText {...content} />
          </div>
        )}
      </div>
    </div>
  );
};
