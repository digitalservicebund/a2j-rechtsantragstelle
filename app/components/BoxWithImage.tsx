import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import Image, { ImagePropsSchema } from "./Image";
import RichText from "./RichText";

export const BoxWithImagePropsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema.optional(),
  image: ImagePropsSchema.optional(),
  content: z.string().optional(),
});

export type BoxWithImageProps = z.infer<typeof BoxWithImagePropsSchema>;

const BoxWithImage = ({
  identifier,
  heading,
  image,
  content,
}: BoxWithImageProps) => {
  return (
    <div
      id={identifier}
      className="flex flex-row items-start gap-32 max-[499px]:flex-col-reverse"
    >
      {image && (
        <Image
          {...image}
          {...{
            className: "w-[120px]",
          }}
        />
      )}
      <div className={"ds-stack-8 break-words w-full"}>
        {heading && <Heading {...heading} />}
        {content && <RichText markdown={content} />}
      </div>
    </div>
  );
};

export default BoxWithImage;
