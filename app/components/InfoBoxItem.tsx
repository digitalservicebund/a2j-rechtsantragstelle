import { HeadingPropsSchema } from "./Heading";
import Heading from "./Heading";
import RichText from "./RichText";
import { ImagePropsSchema } from "./Image";
import Image from "./Image";
import { ButtonPropsSchema } from "./Button";
import Button from "./Button";
import { z } from "zod";

export const InfoBoxItemPropsSchema = z.object({
  label: HeadingPropsSchema.optional(),
  headline: HeadingPropsSchema.optional(),
  image: ImagePropsSchema.optional(),
  content: z.string().optional(),
  button: ButtonPropsSchema.optional(),
});

export type InfoBoxItemProps = z.infer<typeof InfoBoxItemPropsSchema>;

const InfoBoxItem = ({
  label,
  headline,
  image,
  content,
  button,
}: InfoBoxItemProps) => {
  return (
    <li className="flex flex-row items-center justify-center max-w-none max-[499px]:flex-col pt-32 border-solid border-0 border-t-2 border-gray-400 first:border-none first:pt-0">
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
