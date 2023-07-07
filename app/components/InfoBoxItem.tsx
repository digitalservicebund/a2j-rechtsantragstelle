import { z } from "zod";
import Button, { ButtonPropsSchema } from "./Button";
import Heading, { HeadingPropsSchema } from "./Heading";
import Image, { ImagePropsSchema } from "./Image";
import RichText from "./RichText";

export const InfoBoxItemPropsSchema = z.object({
  identifier: z.string().optional(),
  label: HeadingPropsSchema.optional(),
  headline: HeadingPropsSchema.optional(),
  image: ImagePropsSchema.optional(),
  content: z.string().optional(),
  button: ButtonPropsSchema.optional(),
});

export type InfoBoxItemProps = z.infer<typeof InfoBoxItemPropsSchema>;

const InfoBoxItem = ({
  identifier,
  label,
  headline,
  image,
  content,
  button,
}: InfoBoxItemProps) => {
  return (
    <li
      id={identifier}
      className="flex flex-row items-center justify-center max-w-none max-[499px]:flex-col pt-32 border-solid border-0 border-t-2 border-gray-400 first:border-none first:pt-0 scroll-my-40"
    >
      {image && (
        <Image
          {...image}
          {...{
            className: "max-[499px]:mb-16 w-[48px] h-[48px] self-baseline",
          }}
        />
      )}
      <div
        className={
          "ds-stack-8 break-words w-full " + (image && "min-[500px]:ml-16")
        }
      >
        {label && <Heading {...label} />}
        {headline && <Heading {...headline} />}
        {content && <RichText markdown={content} />}
        {button && <Button className="max-w-fit mt-16 mb-0" {...button} />}
      </div>
    </li>
  );
};

export default InfoBoxItem;
